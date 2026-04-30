import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// 🔑 UPDATED: Include the description field for the role data
interface RoleDialogData {
  isEdit: boolean;
  role: { key: string; name: string; description?: string } | null; 
}

@Component({
  selector: 'app-role-form-dialog',
  templateUrl: './role-form-dialog.component.html',
  styleUrls: ['./role-form-dialog.component.sass']
})
export class RoleFormDialogComponent {
  roleForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RoleFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoleDialogData,
    private fb: FormBuilder
  ) {
    this.roleForm = this.fb.group({
      name: [data.role?.name || '', Validators.required],
      key: [data.role?.key || '', [Validators.required, Validators.pattern(/^[A-Z_]+$/)]],
      // 🔑 ADDED: Description field (optional, no validator needed)
      description: [data.role?.description || ''] 
    });

    if (data.isEdit) {
        // Disable key editing for security if updating
        this.roleForm.get('key')?.disable();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.roleForm.invalid) {
      // Simple check, although the button should handle this
      return; 
    }

    // 🔑 CRITICAL FIX FOR DISABLED FIELD:
    // 1. Get the current value from the form (which excludes disabled fields by default).
    const formValue = this.roleForm.value;

    // 2. Explicitly include the 'key' control's value, which might be disabled.
    const finalResult = {
      ...formValue,
      key: this.roleForm.get('key')?.value, // Retrieves the value of the disabled key
    };

    // This object (finalResult) is returned to the component calling the dialog
    // and is ready to be sent to your createRole or updateRole API endpoint.
    this.dialogRef.close(finalResult);
  }
}