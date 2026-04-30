import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgxEchartsModule } from "ngx-echarts";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { NgApexchartsModule } from "ng-apexcharts";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSortModule } from "@angular/material/sort";
import { MatTabsModule } from "@angular/material/tabs";
import { MatMenuModule } from "@angular/material/menu";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatRadioModule } from "@angular/material/radio";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { DoctorRoutingModule } from "./doctor-routing.module";

import { AppointmentsComponent } from "./appointments/appointments.component";
import { FormComponent } from "./appointments/form/form.component";
import { DoctorsComponent } from "./doctors/doctors.component";
import { PatientsComponent } from "./patients/patients.component";

import { AppointmentsService } from "./appointments/appointments.service";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ClinicalNotesComponent } from './clinical-notes/clinical-notes.component';
import { ClinicalNoteFormComponent } from './clinical-notes/clinical-note-form/clinical-note-form.component';
import { VitalsSidebarComponent } from './vitals-sidebar/vitals-sidebar.component';

@NgModule({
  declarations: [
    AppointmentsComponent,
    FormComponent,
    DoctorsComponent,
    PatientsComponent,
    ClinicalNotesComponent,
    ClinicalNoteFormComponent,
    VitalsSidebarComponent
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    chartjsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    NgApexchartsModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSortModule,
    MatTabsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatTooltipModule,
    MatRadioModule,
    DragDropModule,
    MatProgressSpinnerModule,
    SharedModule,
  ],
  exports: [AppointmentsComponent, FormComponent, DoctorsComponent, PatientsComponent, ClinicalNotesComponent,VitalsSidebarComponent, ClinicalNoteFormComponent],
  providers: [AppointmentsService],
})
export class DoctorModule {}
