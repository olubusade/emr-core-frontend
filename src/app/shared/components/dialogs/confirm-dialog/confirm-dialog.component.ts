import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Data passed into the dialog
interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: "./confirm-dialog.component.html",
  styleUrls:["./confirm-dialog.component.sass"]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}
  
  onCancel(): void {
    // Closes the dialog, returning false (or nothing, which MatDialog treats as undefined)
    this.dialogRef.close(false); 
  }
}