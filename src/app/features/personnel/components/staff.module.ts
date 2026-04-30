import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { StaffRoutingModule } from "./staff-routing.module";
import { AllstaffComponent } from "./allstaff/allstaff.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { MaterialFileInputModule } from "ngx-material-file-input";
import { MatTabsModule } from "@angular/material/tabs";

import { SharedModule } from "src/app/shared/shared.module";
import { UserDeleteDialogComponent } from "./dialogs/user-delete-dialog/user-delete.component";
import { MatMenuModule } from "@angular/material/menu";
import { StaffProfileComponent } from "./staff-profile/staff-profile.component";

@NgModule({
  declarations: [
    UserDeleteDialogComponent,
    AllstaffComponent,
    StaffProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MaterialFileInputModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    StaffRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatMenuModule,
    MatTableModule,
    MatIconModule
    
  ],
  providers: [],
  exports: [
    UserDeleteDialogComponent
  ]
})
export class StaffModule {}
