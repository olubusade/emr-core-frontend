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
import { MatRadioModule } from "@angular/material/radio";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PatientsRoutingModule } from "./patients-routing.module";
import { AllpatientsComponent } from "./allpatients/allpatients.component";
import { PatientProfileComponent } from "./patient-profile/patient-profile.component";
import { PatientService } from "./allpatients/patient.service";
import { SharedModule } from "src/app/shared/shared.module";
import { AddPatientComponent } from "./add-patient/add-patient.component";
import { NurseModule } from "src/app/modules/nurse/nurse.module";
import { DoctorModule } from "src/app/modules/doctor/doctor.module";


@NgModule({
  declarations: [
    AllpatientsComponent,
    PatientProfileComponent,
    AddPatientComponent
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
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
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatMenuModule,
    MatCheckboxModule,
    MaterialFileInputModule,
    MatProgressSpinnerModule,
    SharedModule,
    NurseModule,
    DoctorModule

  ],
  providers: [PatientService],
})
export class PatientsModule {}
