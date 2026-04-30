import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VitalService } from '../data/services/vital.service';
import { PatientService } from 'src/app/features/patient-chart/data/services/patient.service';
import { Patient } from 'src/app/features/patient-chart/data/models/patient.model';
import { IVital, VitalUnitField } from '../data/interfaces/vital.interface';

@Component({
  selector: 'app-vital-form',
  templateUrl: './vital-form.component.html',
  styleUrls: ['./vital-form.component.scss']
})
export class VitalFormComponent implements OnInit {

  vitalForm: FormGroup;
  appointmentId: string;
  patientId: string;

  isEditMode = false;
  selectedVitalId: string | null = null;

  currentRecord: IVital | null = null;

  loading = false;
  patientInfo: Patient | null = null;
  status: string = 'scheduled';

  lastTakenDate: string | Date | null = null;
  unitFields: VitalUnitField[] = [
  {
    formControl: 'temperatureUnit',
    label: 'Temperature Unit',
    options: [
      { label: 'Celsius (°C)', value: 'C' },
      { label: 'Fahrenheit (°F)', value: 'F' }
    ]
  },
  {
    formControl: 'heightUnit',
    label: 'Height Unit',
    options: [
      { label: 'Centimeters (cm)', value: 'cm' },
      { label: 'Meters (m)', value: 'm' },
      { label: 'Feet (ft)', value: 'ft' },
      { label: 'Inches (in)', value: 'in' }
    ]
  },
  {
    formControl: 'weightUnit',
    label: 'Weight Unit',
    options: [
      { label: 'Kilograms (kg)', value: 'kg' },
      { label: 'Pounds (lb)', value: 'lb' }
    ]
  }
  ];
  
  consciousnessLevels = [
    { label: 'Alert', value: 'ALERT' },
    { label: 'Verbal Response', value: 'VERBAL' },
    { label: 'Pain Response', value: 'PAIN' },
    { label: 'Unresponsive', value: 'UNRESPONSIVE' }
  ];

  triageLevels = [
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
    { label: 'Critical', value: 'CRITICAL' }
  ];

  selectFields = [
  {
    label: 'Consciousness Level',
    formControl: 'consciousnessLevel',
    options: [
      { label: 'Alert', value: 'ALERT' },
      { label: 'Verbal', value: 'VERBAL' },
      { label: 'Pain Response', value: 'PAIN' },
      { label: 'Unresponsive', value: 'UNRESPONSIVE' }
    ]
  },
  {
    label: 'Triage Level',
    formControl: 'triageLevel',
    options: [
      { label: 'Low', value: 'LOW' },
      { label: 'Medium', value: 'MEDIUM' },
      { label: 'High', value: 'HIGH' },
      { label: 'Critical', value: 'CRITICAL' }
    ]
  },
  {
    label: 'Source',
    formControl: 'source',
    options: [
      { label: 'Nurse', value: 'NURSE' },
      { label: 'Device', value: 'DEVICE' },
      { label: 'Manual', value: 'MANUAL' }
    ]
  }
];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private vitalService: VitalService,
    private snackBar: MatSnackBar,
    private patientService: PatientService
  ) {
    this.vitalForm = this.fb.group({
      temperature: ['', [Validators.required, Validators.min(30), Validators.max(45)]],
      bloodPressure: ['', [Validators.required, Validators.pattern(/^\d{2,3}\/\d{2,3}$/)]],
      heartRate: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      respiratoryRate: ['', [Validators.required, Validators.min(5), Validators.max(60)]],
      weightKg: ['', [Validators.required, Validators.min(0.5)]],
      heightCm: ['', [Validators.required, Validators.min(10)]],
      spo2: [0, [Validators.min(0), Validators.max(100)]],
      bmi: [{ value: '', disabled: true }],
      painScale: [0],
      notes: [''],

      source: ['MANUAL', Validators.required],
      consciousnessLevel: ['ALERT', Validators.required],
      triageLevel: ['LOW', Validators.required],

      //UNITS
      temperatureUnit: ['C'],
      heightUnit: ['cm'],
      weightUnit: ['kg']
    });
  }

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
    this.patientId = this.route.snapshot.queryParamMap.get('patientId');
    this.status = this.route.snapshot.queryParamMap.get('status') || 'scheduled';

    if (this.patientId) {
      this.loadPatientDetails();
      this.loadVitalsHistory();
    }

    this.vitalForm.valueChanges.subscribe(() => {
      this.calculateBMI();
    });
  }

  // =========================
  // HISTORY LOADING
  // =========================
  loadVitalsHistory() {
    this.loading = true;

    this.vitalService.getVitalsByPatient(this.patientId).subscribe({
      next: (res: any) => {
        this.loading = false;

        const vitals = res?.data ?? [];

        const isTodayAppointment = this.status !== 'completed';

        if (isTodayAppointment || vitals.length === 0) {
          this.resetForm();
          return;
        }

        const latest = vitals[0];

        this.prefillForm(latest);

        this.currentRecord = latest;
        this.selectedVitalId = latest.id ?? null;
        this.isEditMode = !!latest?.editable;

        this.lastTakenDate = latest?.readingAt ?? null;
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(
          err?.message || 'Error loading vital history',
          'Close',
          { duration: 5000 }
        );
      }
    });
  }

  // =========================
  // PREFILL
  // =========================
  prefillForm(vital: IVital) {
    if (!vital) return;

    this.vitalForm.patchValue({
      temperature: vital.temperature ?? '',
      bloodPressure: vital.bloodPressure ?? '',
      heartRate: vital.heartRate ?? '',
      respiratoryRate: vital.respiratoryRate ?? '',
      weightKg: vital.weightKg ?? '',
      heightCm: vital.heightCm ?? '',
      spo2: vital.spo2 ?? 0,
      painScale: vital.painScale ?? 0,
      notes: vital.notes ?? '',
      source: (vital as any).source ?? 'MANUAL',
      consciousnessLevel: (vital as any).consciousnessLevel ?? 'ALERT',
      triageLevel: (vital as any).triageLevel ?? 'LOW',

      temperatureUnit: (vital as any).temperatureUnit ?? 'C',
      heightUnit: (vital as any).heightUnit ?? 'cm',
      weightUnit: (vital as any).weightUnit ?? 'kg'
    });

    this.lastTakenDate = vital.readingAt ?? null;
  }

  // =========================
  // RESET
  // =========================
  resetForm() {
    this.isEditMode = false;
    this.selectedVitalId = null;
    this.currentRecord = null;
    this.lastTakenDate = null;

    this.vitalForm.reset({
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      weightKg: '',
      heightCm: '',
      spo2: 0,
      bmi: '',
      painScale: 0,
      notes: ''
    });
  }

  // =========================
  // HISTORY CLICK
  // =========================
  handleHistoryEdit(vital: IVital) {
    if (!vital) return;

    this.currentRecord = vital;
    this.selectedVitalId = vital.id ?? null;

    this.isEditMode = !!vital.editable;

    this.prefillForm(vital);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.snackBar.open(
      `Viewing record from ${new Date(vital.readingAt).toLocaleDateString()}`,
      'OK',
      { duration: 3000 }
    );
  }

  // =========================
  // BMI CALC
  // =========================
  calculateBMI() {
    const weight = this.vitalForm.get('weightKg')?.value;
    const height = this.vitalForm.get('heightCm')?.value;

    if (!weight || !height) return;

    const bmi = weight / ((height / 100) ** 2);

    this.vitalForm.get('bmi')?.setValue(
      Number(bmi.toFixed(1)),
      { emitEvent: false }
    );
  }
  // =========================
  // SUBMIT
  // =========================
  onSubmit() {
    
    if (this.vitalForm.invalid) {
      this.vitalForm.markAllAsTouched();
      return;
    }

    // safety guard (kept but clarified)
    if (!this.isEditMode && this.selectedVitalId) return;

    this.loading = true;

    const payload = {
      ...this.vitalForm.getRawValue(),
      appointmentId: this.appointmentId,
      patientId: this.patientId,
      readingAt: new Date().toISOString(),
      spo2: this.vitalForm.value.spo2 ?? 0
    };

    const request =
      this.isEditMode && this.selectedVitalId
        ? this.vitalService.updateVital(this.selectedVitalId, payload)
        : this.vitalService.createVital(payload);

    const msg = this.isEditMode ? 'updated' : 'saved';

    request.subscribe({
      next: () => {
        this.snackBar.open(`Vitals ${msg} successfully`, 'Close', {
          duration: 3000
        });

        this.router.navigate(['/appointments/today']);
      },
      error: (err) => {
        this.loading = false;

        this.snackBar.open(
          err?.message || 'Validation failed',
          'Close',
          { duration: 5000 }
        );
      }
    });
  }

  // =========================
  // PATIENT
  // =========================
  loadPatientDetails() {
    this.loading = true;
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (patient) => {
        this.loading = false;
        this.patientInfo = patient ?? null;
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(
          err?.message || 'Could not load patient profile',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  onSliderChange(event: any) {
    const val = event?.value ?? 0;
    this.vitalForm.get('painScale')?.patchValue(Number(val));
  }

  getPainColor(value: number): string {
    if (value <= 3) return 'col-green';
    if (value <= 6) return 'col-orange';
    return 'col-red';
  }
}