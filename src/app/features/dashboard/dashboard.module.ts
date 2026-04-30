import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { AdminViewComponent } from "./components/admin-view/admin-view.component";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgApexchartsModule } from "ng-apexcharts";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "src/app/shared/shared.module";
import { DashboardRootComponent } from './components/dashboard-root/dashboard-root.component';
import { DoctorViewComponent } from './components/doctor-view/doctor-view.component';
import { NurseViewComponent } from './components/nurse-view/nurse-view.component';
import { ReceptionistViewComponent } from './components/receptionist-view/receptionist-view.component';
import { PatientViewComponent } from './components/patient-view/patient-view.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [AdminViewComponent, DashboardRootComponent, DoctorViewComponent, NurseViewComponent, ReceptionistViewComponent, PatientViewComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    chartjsModule,
    NgApexchartsModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTooltipModule,
    MatTabsModule,
    ComponentsModule,
    SharedModule,
  ],
})
export class DashboardModule {}
