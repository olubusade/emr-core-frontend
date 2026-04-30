import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../service/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.authService.user;
    if (!user) {
      this.authService.redirectToLogin();
      return false;
    }

    const requiredRoles: string[] = route.data['roles'] || [];
    const requiredPermissions: string[] = route.data['permissions'] || [];

    const userRoles = this.authService.getUserRoles();           // e.g. ['ADMIN']
    const userPermissions = this.authService.getUserPermissions(); // e.g. ['USER_READ']

    console.log('requiredRoles::', requiredRoles);
    console.log('requiredPermissions::',requiredPermissions);
    
    console.log('userRoles::', userRoles);
    console.log('userPermissions::',userPermissions);

    //Role check
    if (requiredRoles.length && !requiredRoles.some(r => userRoles.includes(r))) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    //Permission check
    if (requiredPermissions.length && !this.authService.hasAnyPermission(requiredPermissions)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
