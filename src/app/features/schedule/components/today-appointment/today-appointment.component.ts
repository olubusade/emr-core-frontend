import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppointmentService } from "../../data/services/appointment.service";
import { AuthService } from "src/app/core/service/auth.service";
import { DialogService } from "src/app/shared/service/dialog.service";
import { Appointment } from "../../data/models/appointment.model";
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of
} from "rxjs";
import {
  catchError,
  map,
  startWith,
  switchMap,
  tap
} from "rxjs/operators";
import { ApptType, BaseAppointmentListParams } from "../../data/interfaces/appointment.interface";
import { Router } from "@angular/router";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-today-appointment",
  templateUrl: "./today-appointment.component.html",
  styleUrls: ["./today-appointment.component.sass"],
})
export class TodayAppointmentComponent implements OnInit {
  @ViewChild("filter") filter!: ElementRef;

  appointments$: Observable<Appointment[]> = of([]);

  // pagination state
  totalRecords = 0;
  pageSize = 5;
  currentPage = 1;

  private pageChanged = new BehaviorSubject<number>(this.currentPage);
  private pageSizeChanged = new BehaviorSubject<number>(this.pageSize);
  private filterChanged = new BehaviorSubject<string>("");

  currentUserId: string = "";
  role: any;

  isLoading = false;
  appointmentTypeLabels: Record<ApptType, string> = {
      consultation: 'Consultation',
      follow_up: 'Follow Up',
      emergency: 'Emergency',
      admission: 'Admission',
      procedure: 'Procedure'
    };

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.currentUserId = this.authService.getCurrentUserId();
    this.role = this.authService.getUserRoles();
  }

  ngOnInit(): void {
    this.loadAppointmentsStream();
  }

  // =========================
  // STREAM (MAIN FIXED LOGIC)
  // =========================
  loadAppointmentsStream(): void {
    this.appointments$ = combineLatest([
      this.pageChanged,
      this.pageSizeChanged,
      this.filterChanged.pipe(startWith(""))
    ]).pipe(
      switchMap(([page, limit, search]) => {
        this.isLoading = true;

        const params: BaseAppointmentListParams = {
          page,
          limit,
          timeFrame: "TODAY",
          staffId: this.currentUserId,
          search: search || undefined
        };

        return this.appointmentService.listAppointments(params).pipe(
          tap((res: any) => {
            this.totalRecords = res.total ?? 0;
            this.pageSize = res.pageSize ?? limit;
            this.currentPage = res.page ?? page;
            this.isLoading = false;
          }),

          map((res: any) => res.items ?? []),

          catchError(() => {
            this.isLoading = false;
            this.showNotification("snackbar-danger", "Failed to load appointments");
            return of([]);
          })
        );
      })
    );
  }

  // =========================
  // PAGINATION
  // =========================
  onPageChange(event: PageEvent): void {
    this.pageChanged.next(event.pageIndex + 1);
    this.pageSizeChanged.next(event.pageSize);
  }

  // =========================
  // SEARCH
  // =========================
  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();

    this.filterChanged.next(value);
    this.pageChanged.next(1);
  }

  // =========================
  // ACTIONS
  // =========================
  refreshTable(): void {
    this.pageChanged.next(this.pageChanged.value);
  }

  addNew(): void {
    this.router.navigateByUrl("/appointments/book");
  }

  editCall(row: Appointment): void {
    this.router.navigateByUrl(`/appointments/edit/${row.id}`);
  }

  deleteItem(row: Appointment): void {
    this.dialogService
      .openConfirm("Cancel Appointment", "Are you sure?")
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.appointmentService.deleteAppointment(row.id).subscribe({
            next: () => this.refreshTable(),
            error: () =>
              this.showNotification("snackbar-danger", "Error cancelling appointment"),
          });
        }
      });
  }

  viewPatientHistory(appt: Appointment): void {
    this.router.navigate([`/patients/profile/${appt.patientId}`], {
      queryParams: { tab: "history", source: "today" },
    });
  }

  // =========================
  // VITALS / CONSULTATION
  // =========================
  goToVitals(appt: Appointment): void {
    const today = new Date().toDateString();
    const apptDate = new Date(appt.appointmentDate).toDateString();

    const allowed = ["scheduled", "checked_in", "vitals_taken", "in_progress"];

    if (apptDate !== today && !allowed.includes(appt.status)) {
      this.showNotification(
        "snackbar-danger",
        "Vitals only allowed for active/today appointments"
      );
      return;
    }

    this.router.navigate([`/nurse/vitals/capture/${appt.id}`], {
      queryParams: {
        patientId: appt.patientId,
        status: appt.status,
      },
    });
  }

  goToClinicalNote(appt: Appointment): void {
    this.router.navigate([`/doctor/clinical/capture/${appt.id}`], {
      queryParams: {
        patientId: appt.patientId,
        status: appt.status,
      },
    });
  }

  // =========================
  // HELPERS
  // =========================
  getStatus(appt: any): string {
    const statusMap: any = {
      scheduled: "Scheduled",
      awaiting_vitals: "Awaiting Vitals",
      checked_in: "Checked In",
      vitals_taken:
        this.role?.[0] === "doctor"
          ? "Awaiting Consultation"
          : "Vitals Taken",
      in_progress: "In Consultation",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      statusMap[appt.status] ||
      appt.status?.replace(/_/g, " ").toUpperCase() ||
      "Unknown"
    );
  }

  getConsultationTooltip(appt: any): string {
    if (appt.status === "completed") {
      return "View/Edit Completed Consultation";
    }
    if (appt.status === "vitals_taken") {
      return "Start Consultation";
    }
    return "Vitals required before consultation";
  }

  // =========================
  // NOTIFICATION
  // =========================
  showNotification(color: string, message: string): void {
    this.snackBar.open(message, "", {
      duration: 2000,
      panelClass: color,
    });
  }
  getCheckinIcon(status: string): string {
  switch (status) {
    case 'scheduled': return 'login';        // check-in
    case 'checked_in': return 'logout';      // check-out
    case 'completed': return 'check_circle'; // done
    default: return 'hourglass_empty';
  }
}

getCheckinColor(status: string): string {
  switch (status) {
    case 'scheduled': return 'primary';
    case 'checked_in': return 'accent';
    case 'completed': return 'success';
    default: return '';
  }
}

getCheckinTooltip(status: string): string {
  switch (status) {
    case 'scheduled': return 'Check-in patient';
    case 'checked_in': return 'Check-out patient';
    case 'completed': return 'Visit completed';
    default: return 'Status';
  }
}
  handleCheckinClick(app: any) {

  if (app.status === 'scheduled') {
    this.dialogService.openConfirm('Check-in Patient', 'Proceed to check-in this patient?').afterClosed().subscribe(
      confirmed => {
        if(confirmed) this.updateStatus(app, 'checked_in')
       }
    )
  }
    

  else if (app.status === 'checked_in') {
    this.dialogService.openConfirm('Check-in Patient', 'Proceed to check-out this patient?').afterClosed().subscribe(
      confirmed => {
        if(confirmed) this.updateStatus(app, 'completed')
       }
    )
  }
  }
  updateStatus(app: any, status: string) {
  this.appointmentService.updateAppointmentStatus(app.id, status ).subscribe({
    next: () => {
      app.status = status;
    }
  });
}
}