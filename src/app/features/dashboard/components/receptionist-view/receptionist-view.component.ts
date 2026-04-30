import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, forkJoin } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";
import { User } from "src/app/core/domain/interfaces/user.interface";
import { PatientService } from "src/app/features/patient-chart/data/services/patient.service";
import { PatientListItem } from "src/app/features/patient-chart/data/interfaces/patient.interface";
import { IUserListParams } from "src/app/features/personnel/data/interfaces/user.interface";
import { StaffService } from "src/app/features/personnel/data/services/user.service";
import { Appointment } from "src/app/features/schedule/data/models/appointment.model";
import { AppointmentService } from "src/app/features/schedule/data/services/appointment.service";
import { MetricsService } from "../../data/services/metrics.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-receptionist-view',
  templateUrl: './receptionist-view.component.html',
  styleUrls: ['./receptionist-view.component.sass']
})
export class ReceptionistViewComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>(); 
  
  isLoading: boolean = true; // Initial loading state

  patientCount: number = 0;
  bookedAppointments: Appointment[] = []; 
  patientList: PatientListItem[] = []; 
  staffList: User[] = []; 
    
  totalAppointments: number = 0;
  userCount: number = 0;
  totalEarnings: number = 0;

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

  loadDashboardData(): void {
    this.isLoading = true;

    // forkJoin waits for ALL observables to emit before completing
    forkJoin({
      metrics: this.metricsService.getMetrics(),
      appointments: this.appointmentsService.listAppointments({ page: 1, limit: 6 }),
      staff: this.userService.listUsers({ page: 1, limit: 10 }),
      patients: this.patientService.listPatients({ page: 1, limit: 6 })
    })
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false) // Spinner turns off even if an error occurs
    )
    .subscribe({
      next: (results: any) => {
        // 1. Metrics
        const m = results.metrics?.data;
        this.patientCount = m?.patientCount || 0;
        this.userCount = m?.userCount || 0;
        this.totalAppointments = m?.totalAppointments || 0;
        this.totalEarnings = m?.revenue || 0;

        // 2. Appointments
        this.bookedAppointments = results.appointments?.items || results.appointments?.data?.items || [];

        // 3. Staff
        this.staffList = results.staff?.items || [];

        // 4. Patients
        this.patientList = results.patients?.items || results.patients?.data || [];
      },
      error: (err) => {
        this.snackBar.open(err?.message || 'Error loading dashboard', 'Close', {
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