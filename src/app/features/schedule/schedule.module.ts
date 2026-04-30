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
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSortModule } from "@angular/material/sort";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { AppointmentRoutingModule } from "./schedule-routing.module";

import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "../../shared/shared.module";

import { AppointmentDetailComponent } from './components/appointment-detail/appointment-detail.component';
import { AppointmentListViewComponent } from './components/appointment-list-view/appointment-list-view.component';

import { PastAppointmentComponent } from "./components/past-appointment/past-appointment.component";
import { DeleteComponent } from "./components/today-appointment/dialogs/delete/delete.component";
import { FormDialogComponent } from "./components/today-appointment/dialogs/form-dialog/form-dialog.component";
import { TodayAppointmentComponent } from "./components/today-appointment/today-appointment.component";

import { UpcomingAppointmentComponent } from "./components/upcoming-appointment/upcoming-appointment.component";
import { BookappointmentComponent } from "./components/bookappointment/bookappointment.component";

@NgModule({
  declarations: [
    BookappointmentComponent,
    AppointmentDetailComponent,
    AppointmentListViewComponent,

    FormDialogComponent,
    UpcomingAppointmentComponent,
    PastAppointmentComponent,
    
    TodayAppointmentComponent,
    DeleteComponent,
  ],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
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
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MaterialFileInputModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    SharedModule,
  ],
  providers: [],
})
export class ScheduleModule {}
