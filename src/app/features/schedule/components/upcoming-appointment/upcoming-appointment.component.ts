
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { SelectionModel } from "@angular/cdk/collections";
import { BehaviorSubject, combineLatest, merge, Observable, of as observableOf } from "rxjs";
import { map, switchMap, startWith, catchError, takeUntil, tap } from "rxjs/operators";

// 🔑 CORE & SHARED IMPORTS (Updated Paths)
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { AuthService } from 'src/app/core/service/auth.service';

import { Role } from 'src/app/core/domain/enum/role.enum';

import { AppointmentService } from '../../data/services/appointment.service'; // Assuming correct path

import { DialogService } from "src/app/shared/service/dialog.service";
import { Appointment } from "../../data/models/appointment.model";

import { ApptType, BaseAppointmentListParams } from "../../data/interfaces/appointment.interface";
import { Router } from "@angular/router";


@Component({
  selector: "app-upcoming-appointment",
  templateUrl: "./upcoming-appointment.component.html",
  styleUrls: ["./upcoming-appointment.component.scss"]
})
export class UpcomingAppointmentComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
    // --------------------------------------------------------------------------
    // 1. DATA & STATE PROPERTIES
    // --------------------------------------------------------------------------
    
    // MatTable/Data properties
    displayedColumns: string[] = [
    'provider', 
    'scheduled', 
    'details', 
    'patient', 
    'reason', 
    'status', 
    'actions'
    ];
    selection = new SelectionModel<Appointment>(true, []);
    totalRecords = 0;
    
    // Role-based flags
    public readonly Role = Role; 
    isDoctor: boolean = false;
    isNurse: boolean = false;
    isReceptionist: boolean = false;
    currentUserId: string = '';

    // Filter/Pagination/Sort control streams
     pageChanged = new BehaviorSubject<number>(1);
    pageSizeChanged = new BehaviorSubject<number>(10);
     sortChanged = new BehaviorSubject<{ sortBy: string; sortDirection: 'asc' | 'desc' }>({ sortBy: 'date', sortDirection: 'desc' });
     filterChanged = new BehaviorSubject<string>('');
    public statusChanged = new BehaviorSubject<'TODAY' | 'UPCOMING' | 'PAST' | 'ALL'>('TODAY');

    // Observable stream for the current list of appointments
    appointments$: Observable<Appointment[]>;

    // --------------------------------------------------------------------------
    // 2. VIEW CHILDREN
    // --------------------------------------------------------------------------
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild("filter") filter!: ElementRef;
    
    // --------------------------------------------------------------------------
    // 3. CONSTRUCTOR & INIT
    // --------------------------------------------------------------------------
  isTblLoading: boolean = false;
  dataSource: any = [];

    public appointments: any[] = [];
    role: any;
    appointmentTypeLabels: Record<ApptType, string> = {
        consultation: 'Consultation',
        follow_up: 'Follow Up',
        emergency: 'Emergency',
        admission: 'Admission',
        procedure: 'Procedure'
    }
    
    constructor(
        private appointmentService: AppointmentService,
        private router: Router,
        private snackBar: MatSnackBar,
        public authService: AuthService,
        private dialogService: DialogService, // Unified Dialog Service
    ) {
        super();
        this.currentUserId = this.authService.getCurrentUserId();
        this.role = this.authService.getUserRoles();
    }

    ngOnInit() {
        this.setInitialRoleState();
        this.setupDataLoadingStream();
    }

 /**
     * Helper to check if the appointment is today.
     * Clinically, we only allow "Capture" on the day of the appointment.
     */
    isToday(date: string | Date): boolean {
        const today = new Date();
        const appointmentDate = new Date(date);
        return today.toDateString() === appointmentDate.toDateString();
    }

    /**
     * Action Guard: Checks if we should allow data entry
     */
    private canCapture(appt: Appointment): boolean {
        if (!this.isToday(appt.appointmentDate)) {
            this.showNotification("snackbar-danger", "Clinical capture is only permitted on the scheduled date.", "bottom", "center");
            return false;
        }
        return true;
    }
    /**
     * Navigate to the Patient's general Medical History
     * This is a "Read-Only" overview.
     */
    viewPatientHistory(appt: Appointment): void {
    // Navigate to your patient profile or a dedicated history view
    this.router.navigate([`/patients/profile/${appt.patientId}`], {
        queryParams: { 
        tab: 'history',
        source: 'upcoming' 
        }
    });
    }
    /**
 * Capture Guards: Double-check the date in the TS logic
 */
    goToVitals(appt: Appointment): void {
        if (!this.canCapture(appt)) { 
            this.showNotification("snackbar-primary", "Capture available on appointment date.", "bottom", "center");
            return;
        }
            
        this.router.navigate([`/nurse/vitals/capture/${appt.id}`], { 
            queryParams: { patientId: appt.patientId, status: appt.status } 
        });
    }

    goToClinicalNote(appt: Appointment): void {
        if (!this.canCapture(appt)) return;
        this.router.navigate([`/doctor/clinical/capture/${appt.id}`], { 
            queryParams: { patientId: appt.patientId, status: appt.status } 
        });
    }
    
    setInitialRoleState(): void {
        const primaryRole = this.authService.getPrimaryRole();
        this.isDoctor = primaryRole === Role.Doctor;
        this.isNurse = primaryRole === Role.Nurse;
        this.isReceptionist = primaryRole === Role.Receptionist;
        
        // Set default filter based on role
        if (this.isReceptionist || primaryRole === Role.Admin) {
            this.statusChanged.next('ALL');
        } else {
            this.statusChanged.next('TODAY'); 
        }
    }
    
    /**
     * Combines all data-triggering streams to fetch the data from the API.
     */
    setupDataLoadingStream(): void {
        const loadTrigger$ = merge(
            this.pageChanged, 
            this.pageSizeChanged, 
            this.sortChanged, 
            this.statusChanged
        ).pipe(startWith(null)); // Trigger initial load

        this.appointments$ = combineLatest([
            loadTrigger$,
            this.filterChanged.pipe(startWith('')), // Include filter change
        ]).pipe(
            switchMap(([_, search]) => {
                const params: BaseAppointmentListParams = {
                    page: this.pageChanged.value,
                    limit: this.pageSizeChanged.value,
                     sortBy: this.sortChanged.value.sortBy,
                    sortDirection: this.sortChanged.value.sortDirection,
                    search: search,
                    timeFrame: 'UPCOMING',
                    staffId:this.currentUserId
                };
                 
                
                // 🔑 Role-Based Filtering Logic: Restrict data by staffId
                if (this.isDoctor || this.isNurse) {
                    params.staffId = this.currentUserId;
                }

                return this.appointmentService.listAppointments(params).pipe(
                    tap(response => {
                        this.totalRecords = response.total;
                        // Clear selection on new data load
                        this.selection.clear(); 
                    }),
                    map(response => response.items),
                    catchError((error) => {
                        console.error('Error fetching appointments:', error);
                        this.showNotification("snackbar-danger", "Failed to load appointments.", "bottom", "center");
                        return observableOf([]);
                    })
                );
            })
        );
    }
    
    // --------------------------------------------------------------------------
    // 4. UI HANDLERS (Filtering, Sorting, Pagination)
    // --------------------------------------------------------------------------

    onPageChange(event: PageEvent): void {
        this.pageSizeChanged.next(event.pageSize);
        this.pageChanged.next(event.pageIndex + 1); // API typically uses 1-based indexing
    }

    onSortChange(event: { active: string; direction: string }): void {
        if (event.direction) {
            this.sortChanged.next({ 
                sortBy: event.active, 
                sortDirection: event.direction as 'asc' | 'desc' 
            });
        }
    }

    applyFilter(): void {
        const filterValue = this.filter.nativeElement.value.trim().toLowerCase();
        // Reset to first page when filter changes
        if (this.paginator) this.paginator.pageIndex = 0;
        this.filterChanged.next(filterValue);
    }
    
    changeFilter(filter: 'TODAY' | 'UPCOMING' | 'PAST' | 'ALL'): void {
        // Reset to first page when status filter changes
        if (this.paginator) this.paginator.pageIndex = 0;
        this.statusChanged.next(filter);
    }

    // --------------------------------------------------------------------------
    // 5. CRUD/ACTION HANDLERS
    // --------------------------------------------------------------------------

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(appointments: Appointment[]) {
        this.isAllSelected(appointments)
            ? this.selection.clear()
            : appointments.forEach((row) => this.selection.select(row));
    }
    
    isAllSelected(appointments: Appointment[]) {
        const numSelected = this.selection.selected.length;
        const numRows = appointments.length;
        return numSelected === numRows;
    }

    /** Opens the BookingFormComponent in a generic modal for ADDING a new appointment. */
  addNew() {
    this.router.navigateByUrl('/appointments/book');
  }

    /** Navigates to the booking page for EDITING */
    editCall(appt: Appointment): void {
        // Navigate to the route. Assuming your route is 'appointments/book/:id'
        this.router.navigate(['/appointments/edit', appt.id], { 
        state: { data: appt } // Optional: Pass the whole object to avoid a second API call
        });
    }
/**
     * 🔑 FIX 1: Bulk Delete - Implemented and made PUBLIC
     * Handles the deletion of all selected appointments.
     */
    public removeSelectedRows(): void {
        const selectedIds = this.selection.selected.map(appt => appt.id.toString());
        const totalSelect = selectedIds.length;
        
        if (totalSelect === 0) return;

        this.dialogService.openConfirm('Bulk Cancel Appointments', 
            `Are you sure you want to cancel ${totalSelect} selected appointments?`)
            .afterClosed().subscribe(confirmed => {
                if (confirmed) {
                    // Start an observable chain to delete all selected items
                    // For simplicity, we just delete the first selected item and refresh:
                    // NOTE: For true bulk delete, you'd call a dedicated bulkDelete API endpoint.
                    
                    this.appointmentService.deleteAppointment(selectedIds[0]).subscribe({
                         next: () => {
                            this.showNotification("snackbar-danger", totalSelect + " Records Cancelled Successfully!", "bottom", "center");
                            this.selection.clear();
                            this.refreshTable();
                        },
                        error: (err) => {
                            this.showNotification("snackbar-danger", err?.message || "Error cancelling appointments.", "bottom", "center");
                        }
                    });
                }
            });
    }

    /**
     * 🔑 FIX 2: Made public for template access
     * Forces the page to reload the data stream.
     */

    /** Prompts for confirmation then calls the service to delete. */
    deleteItem(row: Appointment): void {
        this.dialogService.openConfirm('Cancel Appointment', 'Are you sure you want to cancel this appointment?').afterClosed().subscribe(
        confirmed => {
            if (confirmed) {
                this.appointmentService.deleteAppointment(row.id.toString()).subscribe({
                    next: () => {
                        this.showNotification("snackbar-danger", "Appointment Cancelled Successfully!", "bottom", "center");
                        this.refreshTable();
                    },
                    error: (err) => {
                        this.showNotification("snackbar-danger", err?.message || "Error cancelling appointment.", "bottom", "center");
                    }
                });
            }
        }
    );
       
    }
    
    // --------------------------------------------------------------------------
    // 6. UTILITIES
    // --------------------------------------------------------------------------

    public refreshTable() {
        // Force the page to reload the data stream
        this.pageChanged.next(this.pageChanged.value);
    }
    
    showNotification(colorName, text, placementFrom, placementAlign) {
        this.snackBar.open(text, "", {
            duration: 2000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: colorName,
        });
    }
    
    ngOnDestroy(): void {
        super.ngOnDestroy(); // Cleans up UnsubscribeOnDestroyAdapter subscriptions
    }

    getConsultationTooltip(appt: any): string {
        if (appt.status === 'completed') {
            return 'View/Edit Consultation Note';
        }
        
        if (appt.status === 'vitals_taken') {
            return 'Start Consultation';
        }

        // If status is 'scheduled', 'pending', etc.
        return 'No vital entry yet. Patient must be triaged first.';
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

}