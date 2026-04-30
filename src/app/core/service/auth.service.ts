import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "src/environments/environment";
import { LoginResponse } from "../domain/interfaces/login-response.interface";
import { ApiResponse } from "../domain/interfaces/api-response.interface";
import { LogoutResponse } from "../domain/interfaces/logout-response.interface";
import { Role } from "../domain/enum/role.enum";
import { appConfig } from "../config/config";

@Injectable({ providedIn: "root" })
export class AuthService {
  // Base URL for all authentication endpoints
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // BehaviorSubject to hold the current user data (including tokens and profile)
  private currentUserSubject: BehaviorSubject<LoginResponse | null>;
  // Public observable for components to subscribe to user changes
  public currentUser$: Observable<LoginResponse | null>;

  // Timer reference for automatic token refreshing
  private refreshTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    // Initialize the subject by checking for a stored user in local storage
    this.currentUserSubject = new BehaviorSubject<LoginResponse | null>(
      this.loadStoredUser()
    );
    this.currentUser$ = this.currentUserSubject.asObservable();

    // If a valid user was loaded on service creation, start the refresh timer
    if (this.currentUserValue?.accessToken) {
      this.startRefreshTimer(this.currentUserValue.accessToken);
    }
  }

  /** ---------------- Getters ---------------- */

  // Synchronous getter to retrieve the current user object directly
  public get currentUserValue(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  // Getter for just the user profile data (excluding tokens)
  get user(): LoginResponse['user'] | null {
    return this.currentUserValue?.user || null;
  }

  // Getter for the active access token (used by the JWT interceptor)
  getAccessToken(): string | null {
    return this.currentUserValue?.accessToken || null;
  }

  // Getter for the refresh token
  getRefreshToken(): string | null {
    return this.currentUserValue?.refreshToken || null;
  }

  /** ---------------- Storage helpers ---------------- */

  // Reads the serialized user data from local storage
  private loadStoredUser(): LoginResponse | null {
    const json = localStorage.getItem(appConfig.storage.currentUser);
    return json ? JSON.parse(json) : null;
  }

  // Stores the user data to local storage and updates the BehaviorSubject
  private storeUser(user: LoginResponse | null): void {
    if (user) {
      localStorage.setItem(appConfig.storage.currentUser, JSON.stringify(user));
    } else {
      localStorage.removeItem(appConfig.storage.currentUser);
    }
    this.currentUserSubject.next(user);
  }

  /** ---------------- Auth API ---------------- */

  // Handles user login request
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        // Extract the actual user data from the ApiResponse wrapper
        map(resp => resp.data),
        tap(user => {
          // Store the user data and start the auto-refresh process
          this.storeUser(user);
          this.startRefreshTimer(user.accessToken);
        })
      );
  }
  getCurrentUserId(): string {
    // The user object contains the ID field (e.g., 'id') which is the UUID of the user.
    return this.user?.id || '';
  }
  // Requests a new access token using the stored refresh token
  refreshAccessToken(refreshToken: string): Observable<LoginResponse> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        map(resp => resp.data),
        tap(user => {
          // Only update the tokens and restart the timer; keep the existing user details
          this.storeUser({
            ...this.currentUserValue!,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            user: { ...user.user } // keep permissions inside user
          });
          this.startRefreshTimer(user.accessToken);
        }),
        catchError(err => {
          // If refresh fails (e.g., token expired/invalid), redirect to login
          this.redirectToLogin();
          return throwError(() => err);
        })
      );
  }

  // Notifies the backend to invalidate the refresh token
  logout(refreshToken?: string): Observable<LogoutResponse> {
    const token = refreshToken || this.getRefreshToken();
    return this.http.post<LogoutResponse>(`${this.apiUrl}/logout`, { refreshToken: token }).pipe(
      // Clear local session regardless of backend success/failure
      tap(() => this.redirectToLogin())
    );
  }

  /** ---------------- Redirect Helper ---------------- */

  // Clears all user data and redirects to the sign-in page
  redirectToLogin(): void {
    this.storeUser(null);       // Clear BehaviorSubject and localStorage
    this.clearRefreshTimer();   // Stop any active refresh timer
    sessionStorage.clear();     // Clear sessionStorage for good measure
    this.router.navigate(['/auth/signin']);
  }

  /** ---------------- Dynamic Role-based redirect ---------------- */

  // Directs the user to the appropriate module dashboard based on their role(s)
  redirectToModule(): void {
    this.router.navigate(['/dashboard']);
  }

  /** ---------------- Role helpers ---------------- */

  // Retrieves the list of roles assigned to the current user
  getUserRoles(): string[] {
    return this.user?.roles || [];
  }

  // Checks if the current user has a specific role
  hasRole(role: Role | string): boolean {
    return this.getUserRoles().includes(role as string);
  }

  // Checks if the current user has at least one of the specified roles
  hasAnyRole(roles: (Role | string)[]): boolean {
    return roles.some(r => this.hasRole(r));
  }
  // This assumes the first role in the array is the primary/highest priority role.
  getPrimaryRole(): Role | null {
    const roles = this.getUserRoles();
    if (roles.length > 0) {
        // You might need custom logic here (e.g., highest priority role mapping)
        // For simplicity, we use the first one found.
        return roles[0] as Role; 
    }
    return null;
  }
  
  /** ---------------- Permission helpers ---------------- */

  // Retrieves the granular list of permissions (e.g., APPOINTMENT_CREATE)
  getUserPermissions(): string[] {
    return this.user?.permissions || [];
  }
  public getPrimaryRoleUpper(): string | null {
    const role = this.getPrimaryRole();
    return role ? role.toUpperCase() : null;
  }
  /**
 * Checks if the current user has a specific, single permission key.
 * * @param requiredPermissionKey The permission key (e.g., 'PERMISSION_READ') to check.
 * @returns true if the user's permission list contains an object with that key.
 */
  hasPermission(requiredPermissionKey: string): boolean {
    // 1. Get the list of permission objects.
    // We assume this returns: Array<{ key: string, name: string }>
    const userPermissionObjects = this.getUserPermissions(); 

    // 2. Use Array.prototype.some() to check if AT LEAST ONE permission object 
    //    has a 'key' that matches the requiredPermissionKey.
    //    This is the only line that needs to be updated.
    return userPermissionObjects.some(
      (permissionObject:any) => permissionObject.key === requiredPermissionKey
    );
  }

  // Checks if the current user has at least one of the specified permissions
  hasAnyPermission(permissions: string[]): boolean {
    
    return permissions.some(p => this.getUserPermissions().includes(p));
  }

  /** ---------------- Token refresh timer ---------------- */

  // Sets a timeout to automatically call the refresh API before the token expires
  private startRefreshTimer(accessToken: string): void {
    this.clearRefreshTimer();
    try {
      // Decode the JWT payload to find the expiry time ('exp')
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expires = payload.exp * 1000; // Convert to milliseconds
      // Set the timeout to be 1 minute (60,000ms) before the token actually expires
      const timeout = expires - Date.now() - 60_000; 

      if (timeout > 0) {
        this.refreshTimer = setTimeout(() => {
          const refresh = this.getRefreshToken();
          // Only attempt refresh if a refresh token exists
          if (refresh) this.refreshAccessToken(refresh).subscribe();
        }, timeout);
      }
    } catch (err) {
      console.error('Failed to parse token for refresh timer', err);
    }
  }

  // Clears any active refresh timer
  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}