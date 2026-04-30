import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { BehaviorSubject, combineLatest, merge, Observable, of as observableOf, of } from "rxjs";
import { map, switchMap, startWith, catchError, tap, debounceTime } from "rxjs/operators";
import { SelectionModel } from "@angular/cdk/collections";

import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { AuthService } from 'src/app/core/service/auth.service';
import { Role } from 'src/app/core/domain/enum/role.enum';
import { AppointmentService } from '../../data/services/appointment.service';
import { DialogService } from "src/app/shared/service/dialog.service";
import { Appointment } from "../../data/models/appointment.model";
import { BookappointmentComponent } from "../bookappointment/bookappointment.component";
import { ApptType, BaseAppointmentListParams } from "../../data/interfaces/appointment.interface";
import { Router } from "@angular/router";


@Component({
  selector: "app-past-appointment",
  templateUrl: "./past-appointment.component.html",
  styleUrls: ["./past-appointment.component.sass"]
})
export class PastAppointmentComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnDestroy {

  // ------------------------------
  // DATA & STATE
  // ------------------------------
  selection = new SelectionModel<Appointment>(true, []);
  totalRecords = 0;
  appointments$: Observable<Appointment[]>;

  public readonly Role = Role;
  isDoctor = false;
  isNurse = false;
  isReceptionist = false;
  currentUserId = '';
  isTblLoading: boolean = false;

  pageChanged = new BehaviorSubject<number>(1);
  pageSizeChanged = new BehaviorSubject<number>(3);
  sortChanged = new BehaviorSubject<{ sortBy: string; sortDirection: 'asc' | 'desc' }>({ sortBy: 'date', sortDirection: 'desc' });
  filterChanged = new BehaviorSubject<string>('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("filter") filter!: ElementRef;
  role: any;
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
    public authService: AuthService,
    private dialogService: DialogService,
    private router: Router
  ) {
    super();
    this.currentUserId = this.authService.getCurrentUserId();
    this.role = this.authService.getUserRoles();
  }

  ngOnInit() {
    this.setInitialRoleState();
    this.setupDataLoadingStream();
  }

  setInitialRoleState() {
    const primaryRole = this.authService.getPrimaryRole();
    this.isDoctor = primaryRole === Role.Doctor;
    this.isNurse = primaryRole === Role.Nurse;
    this.isReceptionist = primaryRole === Role.Receptionist;
  }

  setupDataLoadingStream() {
  // Combine all triggers into one stream
  const trigger$ = merge(
    this.pageChanged, 
    this.pageSizeChanged, 
    this.sortChanged, 
    this.filterChanged
  ).pipe(
    debounceTime(300), // Prevent excessive hits during typing
    startWith(null)
  );

  this.appointments$ = trigger$.pipe(
    switchMap(() => {
      this.isTblLoading = true;
      
      const params:BaseAppointmentListParams = {
        page: this.pageChanged.value,
        limit: this.pageSizeChanged.value,
        search: this.filterChanged.value,
        timeFrame: 'PAST',
        staffId:this.currentUserId
      };

      return this.appointmentService.listAppointments(params).pipe(
        tap(resp => {
          this.totalRecords = resp.total;
          this.isTblLoading = false;
        }),
        map(resp => resp.items),
        catchError(err => {
          this.isTblLoading = false;
          this.showNotification("snackbar-danger", "Error loading records", "bottom", "center");
          return of([]);
        })
      );
    })
  );
}

  applyFilter() {
    const filterValue = this.filter.nativeElement.value.trim().toLowerCase();
    if (this.paginator) this.paginator.pageIndex = 0;
    this.filterChanged.next(filterValue);
  }

  onPageChange(event: PageEvent) {
    this.pageSizeChanged.next(event.pageSize);
    this.pageChanged.next(event.pageIndex + 1);
  }

  masterToggle(appointments: Appointment[]) {
    this.isAllSelected(appointments)
      ? this.selection.clear()
      : appointments.forEach(row => this.selection.select(row));
  }

  isAllSelected(appointments: Appointment[]): boolean {
    return this.selection.selected.length === appointments.length;
  }

  addNew() {
    this.router.navigateByUrl('/appointments/book');
  }

  editCall(appt: Appointment) {
    this.dialogService.openModal({ component: BookappointmentComponent, data: { appointment: appt, action: 'edit' }, title: 'Edit Appointment' })
      .afterClosed().subscribe(result => result && this.refreshTable());
  }

  deleteItem(appt: Appointment) {
    this.dialogService.openConfirm('Cancel Appointment', 'Are you sure you want to cancel this appointment?')
      .afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.appointmentService.deleteAppointment(appt.id.toString()).subscribe(() => this.refreshTable());
        }
      });
  }

  removeSelectedRows() {
    const selectedIds = this.selection.selected.map(a => a.id.toString());
    if (!selectedIds.length) return;
    this.dialogService.openConfirm('Bulk Cancel Appointments', `Are you sure you want to cancel ${selectedIds.length} appointments?`)
      .afterClosed().subscribe(confirmed => {
        if (confirmed) {
          selectedIds.forEach(id => this.appointmentService.deleteAppointment(id).subscribe(() => this.refreshTable()));
          this.selection.clear();
        }
      });
  }

  refreshTable() {
    this.pageChanged.next(this.pageChanged.value);
  }

  showNotification(color: string, text: string, from: any, align: any) {
    this.snackBar.open(text, '', { duration: 2000, verticalPosition: from, horizontalPosition: align, panelClass: color });
  }

  /**
 * View Clinical Note from History
 */
viewClinicalNote(appt: any) {
  this.router.navigate([`/doctor/clinical/capture/${appt.id}`], { 
    queryParams: { 
      patientId: appt.patient.id,
      status: 'completed' // This triggers the readonly mode in the form
    } 
  });
}

/**
 * View Vitals from History
 */
canViewVitals(appt: any): boolean {
  const now = new Date();
  const apptDate = new Date(appt.appointmentDate);
  
  // 1. Create a full DateTime object for the appointment
  const [hours, minutes] = appt.appointmentTime.split(':').map(Number);
  const apptFullDateTime = new Date(apptDate);
  apptFullDateTime.setHours(hours, minutes, 0, 0);

  // 2. Define "Incomplete" statuses
  const incompleteStatuses = ['scheduled', 'checked_in', 'awaiting_vitals'];

  // 3. Check if the scheduled time has passed
  const isTimePassed = now > apptFullDateTime;

  // 4. BLOCK if: The time has passed AND no vitals were ever recorded
  if (isTimePassed && incompleteStatuses.includes(appt.status)) {
    return false;
  }
  
  // ALLOW if: It's in the future, OR it's now, OR data already exists (vitals_taken/completed)
  return true;
}
getVitalsTooltip(appt: any): string {
  if (!this.canViewVitals(appt)) {
    return `Session expired. No vitals were recorded by ${appt.appointmentTime}.`;
  }
  return appt.status === 'completed' || appt.status === 'vitals_taken' 
    ? 'View Vitals' 
    : 'Capture Vitals';
}
viewVitals(appt: any) {
  if (!this.canViewVitals(appt)) {
    this.showNotification("snackbar-danger", 'No vital records found for this past appointment.', "bottom", "center");
    return;
  }
  this.router.navigate([`/nurse/vitals/capture/${appt.id}`], { 
    queryParams: { 
      patientId: appt.patient.id,
      status: 'completed'
    } 
  });
}
  viewPatientHistory(appt: Appointment): void {
    // Navigate to your patient profile or a dedicated history view
    this.router.navigate([`/patients/profile/${appt.patientId}`], {
        queryParams: { 
        tab: 'history',
        source: 'today' 
        }
    });
  }
  getPastNoteTooltip(appt: any): string {
    if (appt.status === 'completed') {
      return 'View Clinical Consultation Note';
    }
    
    if (appt.status === 'cancelled') {
      return 'No clinical note: Appointment was cancelled.';
    }

    if (appt.status === 'scheduled' || appt.status === 'pending') {
      return 'No clinical note: Patient did not complete consultation.';
    }

    return 'View Note';
  }
   getStatus(appt: any): string {
    const statusMap: { [key: string]: string } = {
      'scheduled': 'Scheduled',
      'checked_in': 'Checked In',
      'vitals_taken': this.role[0]=== 'doctor' ? 'Awaiting Consultation'  : 'Vitals Taken',
      'in_progress': 'In Consultation',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };

    return statusMap[appt.status] || (appt.status ? appt.status.replace(/_/g, ' ').toUpperCase() : 'Unknown');
   }
  ngOnDestroy() { super.ngOnDestroy(); }
}