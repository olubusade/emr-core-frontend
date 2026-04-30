import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";

import { PatientService } from "src/app/features/patient-chart/data/services/patient.service";
import { StaffService } from "src/app/features/personnel/data/services/user.service";
import { ConfirmDialogComponent } from "src/app/shared/components/dialogs/confirm-dialog/confirm-dialog.component";
import { AppointmentService } from "../../data/services/appointment.service";
import { Appointment } from "../../data/models/appointment.model";

import { IAppointmentCreateDTO, IAppointmentUpdateDTO, ApptType } from "../../data/interfaces/appointment.interface";

@Component({
  selector: "app-bookappointment",
  templateUrl: "./bookappointment.component.html",
  styleUrls: ["./bookappointment.component.sass"],
})
export class BookappointmentComponent implements OnInit {
  bookingForm: FormGroup;
  patients: any[] = []; 
  doctors: any[] = [];  

  minDate: Date = new Date(); // Defaults to "now"
  isEditMode = false;
  appointmentId: string | null = null;
  filteredPatients: any[] = [];

  appointmentTypes: ApptType[] = [
  'consultation',
  'follow_up',
  'emergency',
  'admission',
  'procedure'
];

appointmentTypeLabels: Record<ApptType, string> = {
  consultation: 'Consultation',
  follow_up: 'Follow Up',
  emergency: 'Emergency',
  admission: 'Admission',
  procedure: 'Procedure'
};
  
  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private staffService: StaffService,
    public router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appointmentService : AppointmentService
  ) {
    this.bookingForm = this.fb.group({
      patientId: ["", [Validators.required]], // Replacing First/Last Name
      doctorId: ["", [Validators.required]],  // Mapping to staffId
      appointmentDate: ["", [Validators.required]],
      appointmentTime: ["", [Validators.required]],
      reason: [""],
      notes: [""],
      type: ["consultant", [Validators.required]],
//      priority: ["Normal"] // Added clinical data point
    });
  }

  ngOnInit() {
    this.appointmentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.appointmentId;

    if (this.appointmentId) {
      this.isEditMode = true;
      this.loadAppointment(this.appointmentId);
    }
    this.loadDoctors();
    this.loadPatients();
  }
    loadAppointment(id: string): void {
      this.appointmentService.getAppointment(id).subscribe({
        next: (appt:Appointment) => {
          
          this.bookingForm.patchValue({
            patientId: appt.patientId,
            doctorId: appt.staffId,
            appointmentDate: appt.appointmentDate,
            appointmentTime: appt.appointmentDate.toTimeString().slice(0,5), // Extract "HH:mm"
            reason: appt.reason,
            notes: appt.notes,
            type: appt.type as ApptType,
          });
           this.snackBar.open('Patient data loaded successfully', 'Close', { duration: 3000, panelClass: 'snackbar-success'
          });
        },
        error: (err) => {
          console.error('Failed to load patient', err);
          this.snackBar.open(err?.message || 'Failed to load patient data', 'Close', { duration: 4000, panelClass: 'snackbar-danger' });
          this.router.navigate(['/patients']);
        }
      });
  }
  loadDoctors() {
    const params = {
      roleKey: 'doctor', // 🔑 This is the magic key
      pageSize: 100,      // Get enough for the dropdown
      active: true
    };
    this.staffService.listUsers(params).subscribe({
      next: (res) => {
        this.doctors = res.items; // Adjust based on your API response structure
        console.log('Loaded doctors:', this.doctors);
      },
      error: (err) => {
        console.error('Error fetching doctors', err) 
        this.snackBar.open(err?.message || 'Error loading doctors', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadPatients() {
  const params = {
    page: 1,
    pageSize: 100,
    active: true
  };

  this.patientService.listPatients(params).subscribe({
    next: (res) => {
      this.patients = res.items;
      this.filteredPatients = [...res.items];

      if (this.isEditMode && this.appointmentId) {
        this.bookingForm.get('patientId')?.setValue(
          this.bookingForm.get('patientId')?.value
        );
      }
    }
  });
}
   filterPatients(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
  
    // Update the list the template is actually looking at
    this.filteredPatients = this.patients.filter(p => 
      p.firstName.toLowerCase().includes(searchTerm) || 
      p.lastName.toLowerCase().includes(searchTerm) ||
      p.id.toLowerCase().includes(searchTerm)
    );
  }
  onSubmit() {
    if (this.bookingForm.valid) {
      const rawDate = this.bookingForm.value.appointmentDate; // Date object
      const timeStr = this.bookingForm.value.appointmentTime; // e.g., "14:30"
      
      // Create the final ISO string
      const [hours, minutes] = timeStr.split(':');
      const finalDate = new Date(rawDate);
      finalDate.setHours(+hours, +minutes);

      const payload = {
        ...this.bookingForm.value,
        appointmentDate: finalDate.toISOString(),
        staffId: this.bookingForm.value.doctorId
      };

      console.log("Clean Payload for Backend:", payload);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: this.isEditMode ? 'Confirm Patient Update' : 'Confirm Patient Registration',
          message: this.isEditMode
            ? 'Are you sure you want to update this appointment?'
            : 'Are you sure you want to register this appointment?'
        }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (!result) return;
          
        const formValue = this.bookingForm.value;
          
        const payload: IAppointmentCreateDTO | IAppointmentUpdateDTO = {
          patientId: formValue.patientId,
          staffId: formValue.doctorId,
          appointmentDate: finalDate.toISOString(),
          appointmentTime: formValue.appointmentTime,
          reason: formValue.reason,
          notes: formValue.notes,
          type: formValue.type as ApptType,
        };
          
        if (this.isEditMode && this.appointmentId) {
          this.appointmentService.updateAppointment(this.appointmentId, payload as IAppointmentUpdateDTO).subscribe({
            next: () => {
              this.snackBar.open('Appointment updated successfully', 'Close', { duration: 3000, panelClass: 'snackbar-success' });
              this.router.navigate(['/appointments/today']);
            },
            error: (err) => {
              console.error('Update failed', err);
              this.snackBar.open(err?.message ||'Failed to update appointment', 'Close', { duration: 4000, panelClass: 'snackbar-danger' });
            }
          });
        } else {
          this.appointmentService.createAppointment(payload as IAppointmentCreateDTO).subscribe({
            next: () => {
              this.snackBar.open('Appointment created successfully', 'Close', { duration: 3000, panelClass: 'snackbar-success' });
              this.bookingForm.reset();
              this.router.navigate(['/appointments/today']);
            },
            error: (err) => {
              console.error('Create appointment failed', err);
              this.snackBar.open(err?.message || 'Failed to register appointment', 'Close', { duration: 4000, panelClass: 'snackbar-danger' });
            }
          });
        }
      });
    }
  }
    
}