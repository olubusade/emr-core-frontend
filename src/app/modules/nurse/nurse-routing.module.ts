import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "../authentication/page404/page404.component";

import { AppointmentsComponent } from "./appointments/appointments.component";
import { NursesComponent } from "./nurses/nurses.component";
import { PatientsComponent } from "./patients/patients.component";

import { AuthGuard } from "../../core/guard/auth.guard"; // adjust if path differs
import { SettingsComponent } from "src/app/features/account/components/settings/settings.component";
import { NurseViewComponent } from "src/app/features/dashboard/components/nurse-view/nurse-view.component";
import { VitalFormComponent } from "./vitals/vital-form/vital-form.component";
import { VitalsComponent } from "./vitals/vitals.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: NurseViewComponent,
    data: { permissions: ["NURSE_DASHBOARD_VIEW"] }
  },
  {
    path: "appointments",
    component: AppointmentsComponent,    
    data: { permissions: ["APPOINTMENT_READ"] }
  },
  {
    path: "nurses",
    component: NursesComponent,
    data: { permissions: ["NURSE_READ"] }
  },
  {
    path: "patients",
    component: PatientsComponent,
    data: { permissions: ["PATIENT_READ"] }
  },
  /* {
    path: "settings",
    component: SettingsComponent,
    data: { permissions: ["NURSE_SETTINGS_MANAGE"] }
  }, */
  { 
    path: 'vitals/capture/:appointmentId', 
    component: VitalFormComponent,
    data: { permissions: ["VITAL_CREATE"] }
  },
  { 
    path: 'vitals/edit/:appointmentId', 
    component: VitalFormComponent,
    data: { permissions: ["VITAL_UPDATE"] }
  },
  { 
    path: 'vitals', 
    component: VitalsComponent,
    data: { permissions: ["VITAL_READ"] }
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NurseRoutingModule {}
