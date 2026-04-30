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

import { AppointmentsComponent } from "./appointments/appointments.component";
import { FormComponent } from "./appointments/form/form.component";
import { NursesComponent } from "./nurses/nurses.component";
import { PatientsComponent } from "./patients/patients.component";

import { AppointmentsService } from "./appointments/appointments.service";

import { NurseRoutingModule } from "./nurse-routing.module";

import { VitalsComponent } from './vitals/vitals.component';
import { VitalFormComponent } from './vitals/vital-form/vital-form.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { MaterialModule } from "src/app/shared/material.module";

@NgModule({
  declarations: [
    AppointmentsComponent,
    FormComponent,
    NursesComponent,
    PatientsComponent,
    VitalsComponent,
    VitalFormComponent,
  ],
  imports: [
    CommonModule,
    NurseRoutingModule,
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
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports:[VitalsComponent],
  providers: [AppointmentsService]
})
export class NurseModule {}
