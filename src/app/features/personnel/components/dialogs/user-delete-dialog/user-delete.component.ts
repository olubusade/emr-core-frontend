import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";

@Component({
  selector: "app-user-delete",
  templateUrl: "./user-delete.component.html",
  styleUrls: ["./user-delete.component.sass"],
})
export class UserDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
 onNoClick(): void {
    // We pass 0 (or false) back to the calling component
    this.dialogRef.close(0); 
  }

  /**
   * Called when the user clicks 'Delete'.
   * Closes the dialog and returns 1 (or true) to indicate confirmation.
   * NOTE: The HTML already handles the close, but we keep this method for clarity.
   */
  confirmDelete(): void {
    // We pass 1 (or true) back to the calling component.
    // The HTML has [mat-dialog-close]="1", so this method is technically optional 
    // but useful if you need intermediate logic before closing.
    this.dialogRef.close(1);
  }
}
