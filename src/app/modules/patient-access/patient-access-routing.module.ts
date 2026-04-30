import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "../authentication/page404/page404.component";
import { AuthGuard } from "src/app/core/guard/auth.guard";
import { RoleGuard } from "src/app/core/guard/role.guard";


const routes: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("./../../features/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
    data: { permissions: ["PATIENT_CREATE"] }
  },
  {
    path: "appointments",
    loadChildren: () =>
      import("../../features/schedule/schedule.module").then(
        (m) => m.ScheduleModule
      ),
    data: { permissions: ["APPOINTMENT_CREATE"] }
  },
  {
    path: "patients",
    loadChildren: () =>
      import("../../features/patient-chart/patients.module").then(
        (m) => m.PatientsModule
      ),
    data: { permissions: ["PATIENT_CREATE"] }
  },
  {
    path: "billing",
    loadChildren: () =>
      import("../../features/billing/billing.module").then(
        (m) => m.BillingModule
      ),
    data: { permissions: ["BILL_CREATE"] }
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientAccessRoutingModule {}
