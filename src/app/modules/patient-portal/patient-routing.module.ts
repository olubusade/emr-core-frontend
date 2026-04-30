import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "../authentication/page404/page404.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PrescriptionsComponent } from "./prescriptions/prescriptions.component";
import { MedicalRecordsComponent } from "./medical-records/medical-records.component";
import { BillingComponent } from "./billing/billing.component";
import { AuthGuard } from "../../core/guard/auth.guard"; // adjust path if needed
import { SettingsComponent } from "src/app/features/account/components/settings/settings.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    data: { permissions: ["PATIENT_DASHBOARD_VIEW"] }
  },
  {
    path: "appointments",
    loadChildren: () =>
      import("../../features/schedule/schedule.module").then(
        (m) => m.ScheduleModule
      ),
    data: { permissions: ["APPOINTMENT_READ"] }
  },
  {
    path: "prescriptions",
    component: PrescriptionsComponent,
    data: { permissions: ["PRESCRIPTION_READ"] }
  },
  {
    path: "records",
    component: MedicalRecordsComponent,
    data: { permissions: ["MEDICAL_RECORD_READ"] }
  },
  {
    path: "billing",
    component: BillingComponent,
    data: { permissions: ["BILLING_VIEW"] }
  },
  {
    path: "settings",
    component: SettingsComponent,
    data: { permissions: ["PATIENT_SETTINGS_MANAGE"] }
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}
