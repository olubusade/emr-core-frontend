import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { MatTableModule } from "@angular/material/table";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { AuditListComponent } from "./audit/audit.component";
import { AuditDetailComponent } from './audit/audit-detail/audit-detail.component';
import { BtgRequestsComponent } from './btg-requests/btg-requests.component';

@NgModule({
  declarations: [
    AuditListComponent,
    AuditDetailComponent,
    BtgRequestsComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
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
export class AdminModule {}
