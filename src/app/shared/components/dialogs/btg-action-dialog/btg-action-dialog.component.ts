import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ReasonOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-btg-action-dialog',
  templateUrl: './btg-action-dialog.component.html'
})
export class BtgActionDialogComponent {
  action: 'APPROVE' | 'REJECT' | 'REVOKE';
  reasonOptions: ReasonOption[] = [];
  form: FormGroup;

  private readonly REASON_MAP: Record<string, ReasonOption[]> = {
    APPROVE: [
      { label: 'Emergency clinical access required', value: 'Emergency clinical access required' },
      { label: 'Patient unconscious / critical care', value: 'Patient unconscious / critical care' },
      { label: 'Doctor unavailable override', value: 'Doctor unavailable override' },
      { label: 'Other', value: 'OTHER' }
    ],
    REJECT: [
      { label: 'Insufficient justification', value: 'Insufficient justification' },
      { label: 'Unauthorized request', value: 'Unauthorized request' },
      { label: 'Duplicate request', value: 'Duplicate request' },
      { label: 'Other', value: 'OTHER' }
    ],
    REVOKE: [
      { label: 'Access no longer required', value: 'Access no longer required' },
      { label: 'Time window exceeded', value: 'Time window exceeded' },
      { label: 'Suspicious activity detected', value: 'Suspicious activity detected' },
      { label: 'Other', value: 'OTHER' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BtgActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: 'APPROVE' | 'REJECT' | 'REVOKE' }
  ) {
    this.action = data.action;
    this.reasonOptions = this.REASON_MAP[this.action] || [];
    
    this.form = this.fb.group({
      reasonType: ['', Validators.required],
      decisionReason: ['']
    });
  }

  get isOtherReason(): boolean {
    return this.form.get('reasonType')?.value === 'OTHER';
  }

  onReasonChange(value: string) {
    // If it's not "OTHER", we sync the value to the hidden reason field automatically
    if (value !== 'OTHER') {
      this.form.patchValue({ decisionReason: value });
      this.form.get('decisionReason')?.clearValidators();
    } else {
      this.form.patchValue({ decisionReason: '' });
      this.form.get('decisionReason')?.setValidators([Validators.required, Validators.minLength(5)]);
    }
    this.form.get('decisionReason')?.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { reasonType, decisionReason } = this.form.value;
    const finalReason = reasonType === 'OTHER' ? decisionReason : reasonType;

    this.dialogRef.close(finalReason);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}