import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillService } from 'src/app/features/billing/data/services/bill.service';
import { PatientService } from "src/app/features/patient-chart/data/services/patient.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bill-form-dialog',
  templateUrl: './bill-form-dialog.component.html',
  styleUrls: ['./bill-form-dialog.component.sass']
})
export class BillFormDialogComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean;
  title: string;

  // Data lists
  patients: any[] = [];
  filteredPatients: any[] = [];

  // Options lists (Must be public for template access)
  public statusOptions = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'pending', label: 'Pending' },
    { value: 'partially_paid', label: 'Partially Paid' },
    { value: 'paid', label: 'Paid' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  public paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'transfer', label: 'Bank Transfer' },
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private patientService: PatientService,
    private billService: BillService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<BillFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = data.action === 'edit';
    this.title = this.isEdit ? 'Edit Billing Record' : 'Generate New Bill';
    this.form = this.initForm();
  }

  ngOnInit() {
    this.loadPatients();
  }

  private initForm(): FormGroup {
    const b = this.data.bill;
    return this.fb.group({
      patientId: [b?.patientId || '', [Validators.required]],
      amount:    [b?.amount || '', [Validators.required, Validators.min(1)]],
      status:    [b?.status || 'unpaid', [Validators.required]],
      dueDate:   [b?.dueDate ? new Date(b.dueDate).toISOString().split('T')[0] : '', []],
      paymentMethod: [b?.paymentMethod || null, []],
      notes:     [b?.notes || '', []],
    });
  }
loadPatients() {
 const params = {
    page: 1, // 🔑 This is the magic key
    pageSize: 100,      // Get enough for the dropdown
    active: true
  };
    this.patientService.listPatients(params).subscribe({
      next: (res: any) => {
        // Mapping to your backend's "data" key
        this.patients = res.data || [];
        this.filteredPatients = [...this.patients];
        
        // Force sync for Edit Mode
        if (this.isEdit) {
          this.form.get('patientId')?.setValue(this.data.bill.patientId);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Could not load patients', err) 
          this.snackBar.open(err?.message || 'Error loading patient', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  filterPatients(event: Event) {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPatients = this.patients.filter(p => 
      p.firstName.toLowerCase().includes(term) || 
      p.lastName.toLowerCase().includes(term)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      const payload = this.form.getRawValue();
      const action$ = this.isEdit 
        ? this.billService.updateBill(this.data.bill.id, payload)
        : this.billService.createBill(payload);

      action$.subscribe({
        next: () => this.dialogRef.close({ success: true }),
        error: (err) => {
          console.error('Save error', err)
          this.snackBar.open(err?.message || 'Error saving / updating bill', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });  
        }
      });
    }
  }

  onCancel() { this.dialogRef.close(); }
}