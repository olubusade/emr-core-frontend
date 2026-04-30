// core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userRoles = this.authService.getUserRoles(); // returns string[]
    const expectedRoles: string[] = route.data['roles'];

    if (!expectedRoles.some(r => userRoles.includes(r))) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }
}
