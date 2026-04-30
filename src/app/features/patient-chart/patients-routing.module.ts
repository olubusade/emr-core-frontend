import { PatientProfileComponent } from "./patient-profile/patient-profile.component";

import { AllpatientsComponent } from "./allpatients/allpatients.component";

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "../../modules/authentication/page404/page404.component";
import { AddPatientComponent } from "./add-patient/add-patient.component";

const routes: Routes = [
  {
    path: "",
    component: AllpatientsComponent,
  },
  {
    path: "all",
    component: AllpatientsComponent,
  },
  {
    path: "add",
    component: AddPatientComponent,
  },
  {
    path: "edit/:id",
    component: AddPatientComponent,
  },
  {
    path: "profile/:id",
    component: PatientProfileComponent,
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
