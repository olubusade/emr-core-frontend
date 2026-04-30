// src/app/dashboard-root.component.ts (REWRITTEN for DRY)

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-dashboard-root',
  templateUrl: './dashboard-root.component.html',
  styleUrls: ['./dashboard-root.component.sass']
})
export class DashboardRootComponent implements OnInit, OnDestroy {
  
  // Property now gets the value directly from the new service method
  public userRole: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUserRole();
  }

  /**
   * Fetches the pre-formatted role string directly from the AuthService.
   */
  private loadUserRole(): void {
    // 🔑 FIX: No more manual .toUpperCase() here! The logic lives in the service.
    this.userRole = this.authService.getPrimaryRoleUpper();
    console.log('User Role::',this.userRole);
    
    if (!this.userRole) {
      console.warn('Dashboard loaded without a valid user role.');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}