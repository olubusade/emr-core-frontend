import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicalService } from '../../doctors/data/services/clinical.service';
import { map, Observable, tap } from 'rxjs';
import { PatientService } from 'src/app/features/patient-chart/data/services/patient.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-clinical-note-form',
  templateUrl: './clinical-note-form.component.html',
  styleUrls: ['./clinical-note-form.component.scss']
})
export class ClinicalNoteFormComponent implements OnInit {
  noteForm: FormGroup;
  appointmentId: string;
  patientId: string;
  patient$: Observable<any>;
  isReadOnly: boolean = false;
  noteDate: Date;
  loading = false;

  isEditMode: boolean = false;
  existingNoteId: string | null = null; // To track if we're editing an existing note

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private clinicalService: ClinicalService,
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.noteForm = this.fb.group({
      // Diagnosis is usually a searchable ICD-10 code string
      diagnosis: ['', [Validators.required, Validators.minLength(3)]],
      
      // What the patient tells you (Symptoms)
      subjective: ['', [Validators.required, Validators.minLength(10)]],
      
      // What the doctor sees (Physical Exam)
      objective: [''], 
      
      // The professional conclusion
      assessment: ['', [Validators.required]],
      
      // What we are going to do next (Meds, Labs, Follow-up)
      plan: ['', [Validators.required]]
    });
  }

ngOnInit(): void {
  this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
  this.patientId = this.route.snapshot.queryParamMap.get('patientId');
  const status = this.route.snapshot.queryParamMap.get('status');

  if (status === 'completed') {
    this.isReadOnly = true;
    this.noteForm.disable();
  }

  if (this.appointmentId && this.patientId) { 
    this.loadCurrentSessionNote();
  }
  if (this.patientId) {
    this.patient$ = this.patientService.getPatientById(this.patientId).pipe(
      tap(response => console.log('Full Backend Response:', response)),
      map(response => response), // Extract the 'data' object for the template
      tap(patientData => console.log('Extracted Patient Data:', patientData))
    );
  }
}
  handleHistorySelect(note: any) {
    this.appointmentId = note.appointmentId;
    // Prefill the form for viewing
    this.noteForm.patchValue(note);
    // If viewing history, we usually keep it read-only to avoid overwriting old notes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
loadCurrentSessionNote() {
  if (!this.appointmentId) return;

  this.loading = true;
  this.clinicalService.getClinicalNotesByAppointment(this.appointmentId,this.patientId).subscribe({
    next: (note) => {
      if (note) {
        this.isEditMode = true;
        this.existingNoteId = note.id; // Store this for the update request
        
        // Populate the SOAP fields
        this.noteForm.patchValue({
          diagnosis: note.diagnosis,
          subjective: note.subjective,
          objective: note.objective,
          assessment: note.assessment,
          plan: note.plan
        });
      }
      this.loading = false;
    },
    error: (err) => {
      this.loading = false;
      // We don't necessarily want an error snackbar here if it's just a 404 (no note yet)
      console.log('No existing note found for this session.');
    }
  });
}
  onSubmit() {
    if (this.noteForm.invalid && !this.isEditMode) return;
    this.loading = true;
    
    const payload = {
      ...this.noteForm.getRawValue(),
      appointmentId: this.appointmentId,
      patientId: this.patientId
    };

    const request = this.isEditMode && this.existingNoteId
      ? this.clinicalService.updateClinicalNote(this.existingNoteId, payload)
      : this.clinicalService.createClinicalNote(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Clinical note saved successfully', 'Close', { duration: 3000 });
        // Optional: navigation or reset
        this.router.navigateByUrl('/appointments/today');
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        
        const msg = err?.message || 'An error occurred while saving the note';
        this.snackBar.open(msg, 'Close', { duration: 5000 });
      }
    });
  }

}
