import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AllstaffComponent } from "./allstaff/allstaff.component";


import { StaffProfileComponent } from "./staff-profile/staff-profile.component";
import { Page404Component } from "../../../modules/authentication/page404/page404.component";
const routes: Routes = [
  {
    path: "",
    component: AllstaffComponent,
    data: { permissions: ['USER_CREATE'] }
  },
  {
    path: "all-staff",
    component: AllstaffComponent,
    data: { permissions: ['USER_CREATE'] }
  },
  {
    path: "staff-profile",
    component: StaffProfileComponent,
    data: { permissions: ['USER_CREATE'] }
  },
  { path: "**", component: Page404Component },
    
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffRoutingModule {}
