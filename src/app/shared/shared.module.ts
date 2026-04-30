import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { MaterialModule } from "./material.module";
import { FeatherIconsModule } from "./components/feather-icons/feather-icons.module";
import { HasPermissionDirective } from "../core/directives/has-permission.directive";
import { ComponentsModule } from "./components/components.module";
import { ShortIdPipe } from "../core/pipes/short-id.pipe";
import { HasRoleDirective } from "../core/directives/has-role.directive";

const SHARED_COMPONENTS_AND_DIRECTIVES = [
  HasPermissionDirective,
  HasRoleDirective
];
@NgModule({
  declarations: [...SHARED_COMPONENTS_AND_DIRECTIVES,
    ShortIdPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    NgbModule,
    FeatherIconsModule,
    ComponentsModule

  ],
  exports: [
    CommonModule,
    FormsModule,
    FeatherIconsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    MaterialModule,
    FeatherIconsModule,
    HasPermissionDirective,
    HasRoleDirective,
    ComponentsModule,
    ShortIdPipe
  ],
})
export class SharedModule {}
