import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { AuthService } from "../service/auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  // Flag to prevent multiple simultaneous refresh calls
  private isRefreshing = false;

  // Subject used to broadcast the new access token once it's refreshed
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  /**
   * Main interceptor entry point.
   * 1. Attaches Authorization header if access token exists
   * 2. Handles 401 errors (expired token → refresh flow)
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();
    
    // Attach access token if available
    if (accessToken) {
      request = this.addTokenHeader(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        // Check if it's an Unauthorized error and not the refresh endpoint itself
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !request.url.includes("/auth/refresh")
        ) {
          // → Attempt refresh
          return this.handle401Error(request, next);
        }

        // Forward other errors to the global error handler
        return throwError(() => error);
      })
    );
  }

  /**
   * Utility function to attach Authorization header
   */
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * Handles 401 Unauthorized errors by:
   *  - Refreshing the token if not already refreshing
   *  - Queuing requests while refresh is in progress
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      // Mark refresh as in progress
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // reset subject

      const refreshToken = this.authService.getRefreshToken();
      if (!refreshToken) {
        // No refresh token available → force logout
        this.isRefreshing = false;
        this.authService.redirectToLogin();
        return throwError(() => new Error("No refresh token available"));
      }

      // Call AuthService to refresh the token
      return this.authService.refreshAccessToken(refreshToken).pipe(
        switchMap((newTokens) => {
          // Refresh successful → broadcast new access token
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newTokens.accessToken);

          // Retry original request with new access token
          return next.handle(this.addTokenHeader(request, newTokens.accessToken));
        }),
        catchError((err) => {
          // Refresh failed (e.g., refresh token expired) → force logout
          this.isRefreshing = false;
          this.authService.redirectToLogin();
          return throwError(() => err);
        })
      );
    } else {
      /**
       * If refresh is already in progress:
       * - Wait until refreshTokenSubject emits the new token
       * - Retry the failed request once we have a valid token
       */
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null), // wait until token is updated
        take(1), // only take the first emitted token
        switchMap((token) => next.handle(this.addTokenHeader(request, token!)))
      );
    }
  }
}
