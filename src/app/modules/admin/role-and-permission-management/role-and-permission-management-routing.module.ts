import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleAndPermissionManagementComponent } from './role-and-permission-management.component';

const routes: Routes = [
  {
      path: "",
      component: RoleAndPermissionManagementComponent,
      data: { permissions: ["PERMISSION_READ"] }
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleAndPermissionManagementRoutingModule { }
