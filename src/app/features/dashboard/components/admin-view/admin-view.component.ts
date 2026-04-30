import { Component, OnDestroy, OnInit } from "@angular/core";
import { takeUntil, finalize } from "rxjs/operators"; 
import { Subject, forkJoin } from "rxjs"; // Added forkJoin

import { IUserListModel, IUserListParams } from "src/app/features/personnel/data/interfaces/user.interface";
import { AppointmentService } from "src/app/features/schedule/data/services/appointment.service";
import { MetricsService } from "../../data/services/metrics.service";
import { StaffService } from "src/app/features/personnel/data/services/user.service";
import { PatientService } from "src/app/features/patient-chart/data/services/patient.service";
import { User } from "src/app/features/personnel/data/models/user.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RoleLabels } from '../../../../core/constants/role-labels';

interface Appointment { patientId: string; staffId: string; appointmentDate: string; reason: string; }
interface PatientListItem { id: string; firstName: string; lastName: string; email: string; dob: string; createdAt: string; }

@Component({
  selector: "app-admin-view",
  templateUrl: "./admin-view.component.html",
  styleUrls: ["./admin-view.component.scss"],
})
export class AdminViewComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>(); 
  
  // New Loading State
  isLoading: boolean = true;

  patientCount: number = 0;
  bookedAppointments: Appointment[] = []; 
  patientList: PatientListItem[] = []; 
  staffList: User[] = []; 
  
  totalAppointments: number = 0;
  userCount: number = 0;
  totalEarnings: number = 0;

  pendingBTGCount = 0;
  activeBTGSessionCount = 0;
  approvedBTGCount = 0;
  rejectedBTGCount = 0;
  recentBTGRequests: any[] = [];

  roleLabels = RoleLabels;
  
  constructor(
    private metricsService: MetricsService, 
    private appointmentsService: AppointmentService, 
    private patientService: PatientService,
    private userService: StaffService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDashboardData(); 
  }

  /**
   * Fetches all necessary data and synchronizes the loading state.
   */
  loadDashboardData(): void {
    this.isLoading = true;

    // Use forkJoin to wait for all primary dashboard data sources
    forkJoin({
      metrics: this.metricsService.getMetrics(),
      appointments: this.appointmentsService.listAppointments({ page: 1, limit: 6 }),
      staff: this.userService.listUsers({ page: 1, limit: 10 }),
      patients: this.patientService.listPatients({ page: 1, limit: 6 })
    })
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false) // Ensures spinner stops even if one fails
    )
    .subscribe({
      next: (results: any) => {
        // 1. Process Metrics
        const metricsRes = results.metrics?.data;
        this.patientCount = metricsRes?.patientCount || 0;
        this.userCount = metricsRes?.userCount || 0;
        this.totalAppointments = metricsRes?.totalAppointments || 0;
        this.totalEarnings = metricsRes?.revenue || 0;
        this.pendingBTGCount = metricsRes?.pendingBTGCount || 0;
        this.activeBTGSessionCount = metricsRes?.activeBTGSessionCount || 0;
        this.approvedBTGCount = metricsRes?.approvedBTGCount || 0;
        this.rejectedBTGCount = metricsRes?.rejectedBTGCount || 0;
        this.recentBTGRequests = metricsRes?.recentBTGRequests || [];

        // 2. Process Appointments
        this.bookedAppointments = results.appointments?.items || results.appointments?.data?.items || [];

        // 3. Process Staff
        this.staffList = results.staff?.items || [];

        // 4. Process Patients
        this.patientList = results.patients?.items || results.patients?.data || [];
      },
      error: (err) => {
        this.snackBar.open(err?.message || 'Error loading dashboard data', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getFormattedRole(role?: string): string {
    if (!role) return '—';
    return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }

  getStaffStatusText(active?: boolean): string {
    return active ? 'Active' : 'Inactive';
  }

  getStaffStatusClass(active?: boolean): string {
    return active ? 'badge col-green' : 'badge col-red';
  }

  ngOnDestroy(): void {
    this.destroy$.next(); 
    this.destroy$.complete();
  }
}