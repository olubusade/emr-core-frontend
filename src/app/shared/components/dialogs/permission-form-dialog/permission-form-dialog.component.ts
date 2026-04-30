import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermissionFormResult } from 'src/app/core/domain/interfaces/permission-form.interface';

@Component({
  selector: 'app-permission-form-dialog',
  templateUrl: './permission-form-dialog.component.html',
  styleUrls: ['./permission-form-dialog.component.sass']
})
export class PermissionFormDialogComponent {

   permissionForm: FormGroup;

  // Assuming no data is passed in (no editing of permissions)
  constructor(
    public dialogRef: MatDialogRef<PermissionFormDialogComponent, PermissionFormResult>, 
    private fb: FormBuilder
  ) {
    this.permissionForm = this.fb.group({
      // 🔑 Key must be uppercase with underscores only
      key: ['', [Validators.required, Validators.pattern(/^[A-Z_]+$/)]], 
      name: ['', [Validators.required]],
      // 🔑 Include the description field
      description: [''] 
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.permissionForm.valid) {
      // The patch value handles uppercasing the key, but we ensure it's correct on close.
      const result: PermissionFormResult = this.permissionForm.value;
      
      // Send the clean, validated result back
      this.dialogRef.close(result);
    }
  }

}
