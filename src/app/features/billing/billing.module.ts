import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BillingRoutingModule } from "./billing-routing.module";
import { BillListComponent } from "./bill-list/bill-list.component";
import { InvoiceComponent } from "./invoice/invoice.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSortModule } from "@angular/material/sort";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "../../shared/shared.module";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { BreadcrumbComponent } from "src/app/shared/components/breadcrumb/breadcrumb.component";
import { BillFormComponent } from './bill-form/bill-form.component';

@NgModule({
  declarations: [
    BillListComponent,
    InvoiceComponent,
    BillFormComponent
  ],
  imports: [
    CommonModule,
    BillingRoutingModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSortModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    SharedModule,
    MatRadioModule,
    MatMenuModule,
    MaterialFileInputModule,
    MatTableModule,
    MatPaginatorModule,
    ComponentsModule
  ],
})
export class BillingModule {}
