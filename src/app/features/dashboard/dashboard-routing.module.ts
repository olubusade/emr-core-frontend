
import { Page404Component } from "../../modules/authentication/page404/page404.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminViewComponent } from "./components/admin-view/admin-view.component";
import { NurseViewComponent } from './components/nurse-view/nurse-view.component';
import { DoctorViewComponent } from './components/doctor-view/doctor-view.component';
import { PatientViewComponent } from "./components/patient-view/patient-view.component";
import { ReceptionistViewComponent } from "./components/receptionist-view/receptionist-view.component";
import { DashboardRootComponent } from "./components/dashboard-root/dashboard-root.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "main",
    pathMatch: "full",
  },
  {
    path: "main",
    component: DashboardRootComponent,
  },
  {
    path: "admin-dashboard",
    component: AdminViewComponent,
  },
  {
    path: "doctor-dashboard",
    component: DoctorViewComponent,
  },
  {
    path: "nurse-dashboard",
    component: NurseViewComponent
  },
  {
    path: "patient-dashboard",
    component: PatientViewComponent,
  },
  {
    path: "receptionist-dashboard",
    component: ReceptionistViewComponent,
  },
  { path: "**", component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
