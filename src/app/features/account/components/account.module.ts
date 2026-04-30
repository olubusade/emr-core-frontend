import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettingsComponent } from "./settings/settings.component";
import { BreadcrumbComponent } from "src/app/shared/components/breadcrumb/breadcrumb.component";
import { SharedModule } from "src/app/shared/shared.module";


@NgModule({
  declarations: [
    SettingsComponent
    
  ],
  imports: [CommonModule,
    SharedModule,     // Provides MatFormField, HasPermission, etc.
    CommonModule, // Provides BreadcrumbComponent
    
  ],
})
export class AccountModule {}
