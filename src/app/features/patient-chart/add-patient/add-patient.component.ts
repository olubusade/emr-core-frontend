import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PatientService } from "../data/services/patient.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, ActivatedRoute } from "@angular/router";
import { IPatientCreateDTO, IPatientUpdateDTO } from "../data/interfaces/patient.interface";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from "src/app/shared/components/dialogs/confirm-dialog/confirm-dialog.component";
import { Patient } from "../data/models/patient.model";

@Component({
  selector: "app-patient-form",
  templateUrl: "./add-patient.component.html",
  styleUrls: ["./add-patient.component.sass"],
})
export class AddPatientComponent implements OnInit {
  patientForm: FormGroup;
  isEditMode = false;
  patientId: string | null = null;

  countries: string[] = ['Nigeria', 'Ghana', 'South Africa', 'UK', 'US', 'Canada', 'Other'];
  nigerianStates: string[] = [
    'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue',
    'Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu',
    'Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi',
    'Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo',
    'Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara','FCT'
  ];

  maxDobDate = new Date();

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    public router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.patientForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.pattern("[a-zA-Z]+")]],
      lastName: ["", [Validators.required, Validators.pattern("[a-zA-Z]+")]],
      gender: ["", Validators.required],
      phone: ["", [
        Validators.required, 
        Validators.pattern("^[0-9]*$"), // Ensures only numbers
        Validators.minLength(10), 
        Validators.maxLength(15)
      ]],
      dob: ["", Validators.required],
      email: ["", [Validators.required, Validators.email, Validators.minLength(5)]],
      maritalStatus: ['', Validators.required],
      address: [""],
      nationality: ['', Validators.required],
      stateOfOrigin: ['', Validators.required],
      occupation: [''],
      bloodGroup: ['', Validators.required],
      genotype: ['', Validators.required],
      emergencyContactName: ['', Validators.required],
      emergencyRelationship: ['', Validators.required],
      emergencyContactPhone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.patientId;

    if (this.isEditMode && this.patientId) {
      this.loadPatient(this.patientId);
    }

    // Reset stateOfOrigin if nationality changes
    this.patientForm.get('nationality')?.valueChanges.subscribe(value => {
    const stateControl = this.patientForm.get('stateOfOrigin');
    if (value === 'Nigeria') {
      stateControl?.setValidators([Validators.required]);
    } else {
      stateControl?.clearValidators();
      stateControl?.reset();
    }
    stateControl?.updateValueAndValidity();
  });
  }

  get f() { return this.patientForm.controls; }

  /** Load patient for edit */
  loadPatient(id: string): void {
    this.patientService.getPatientById(id).subscribe({
      next: (patient: Patient) => {
        
        this.patientForm.patchValue({
          firstName: patient.firstName,
          lastName: patient.lastName,
          gender: patient.gender,
          phone: patient.phone,
          dob: patient.dob,
          email: patient.email,
          maritalStatus: patient.maritalStatus,
          address: patient.address,
          nationality: patient.nationality,
          stateOfOrigin: patient.nationality === 'Nigeria' ? patient.stateOfOrigin : null,
          occupation: patient.occupation,
          bloodGroup: patient.bloodGroup,
          genotype: patient.genotype,
          emergencyContactName: patient.emergencyContact.name,
          emergencyRelationship: patient.emergencyContact.relationship,
          emergencyContactPhone: patient.emergencyContact.phone,
        });
      },
      error: (err) => {
        this.snackBar.open(err?.message || 'Error loading patient list', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/patients']);
      }
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.isEditMode ? 'Confirm Patient Update' : 'Confirm Patient Registration',
        message: this.isEditMode
          ? 'Are you sure you want to update this patient?'
          : 'Are you sure you want to register this patient?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const formValue = this.patientForm.value;

      const payload: IPatientCreateDTO | IPatientUpdateDTO = {
        firstName: formValue.firstName.trim(),
        lastName: formValue.lastName.trim(),
        gender: formValue.gender,
        phone: formValue.phone?.toString().replace(/\D/g, ''), // Strips non-digits
  
        dob: formValue.dob,
        email: formValue.email.toLowerCase(),
        maritalStatus: formValue.maritalStatus,
        address: formValue.address,
        nationality: formValue.nationality,
        stateOfOrigin: formValue.nationality === 'Nigeria' ? formValue.stateOfOrigin : null,
        occupation: formValue.occupation,
        bloodGroup: formValue.bloodGroup,
        genotype: formValue.genotype,
        emergencyContactName: formValue.emergencyContactName,
        emergencyContactPhone: formValue.emergencyContactPhone?.toString().replace(/\D/g, ''),
        emergencyRelationship: formValue.emergencyRelationship,
      };

      if (this.isEditMode && this.patientId) {
        this.patientService.updatePatient(this.patientId, payload as IPatientUpdateDTO).subscribe({
          next: () => {
            this.snackBar.open('Patient updated successfully', 'Close', { duration: 3000, panelClass: 'snackbar-primary' });
            this.router.navigate(['/patients']);
          },
          error: (err) => {
            this.snackBar.open(err?.message || 'Error updating patient', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      } else {
        this.patientService.createPatient(payload as IPatientCreateDTO).subscribe({
          next: () => {
            this.snackBar.open('Patient registered successfully', 'Close', { duration: 3000, panelClass: 'snackbar-primary' });
            this.patientForm.reset();
            this.router.navigate(['/patients']);
          },
          error: (err) => {
            this.snackBar.open(err?.message || 'Error while registering patient', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          }
        });
      }
    });
  }
}