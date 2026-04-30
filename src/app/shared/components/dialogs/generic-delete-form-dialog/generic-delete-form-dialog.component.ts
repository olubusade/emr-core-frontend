import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, OnInit } from "@angular/core";
import { BillService } from "src/app/features/billing/data/services/bill.service";


@Component({
  selector: 'app-generic-delete-form-dialog',
  templateUrl: './generic-delete-form-dialog.component.html',
  styleUrls: ['./generic-delete-form-dialog.component.sass']
})
export class GenericDeleteFormDialogComponent {

  constructor(
      public dialogRef: MatDialogRef<GenericDeleteFormDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public billListService: BillService
    ) {}
    onNoClick(): void {
      this.dialogRef.close();
    }
    confirmDelete(): void {
      this.billListService.deleteBill(this.data.id);
    }
}
