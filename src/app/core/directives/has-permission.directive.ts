import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Directive({ selector: '[appHasPermission]' })
export class HasPermissionDirective implements OnInit {
  // Accept either a single key or multiple keys
  @Input('appHasPermission') requiredPermissions: string | string[] = [];
  @Input('appHasPermissionElse') elseTemplate?: TemplateRef<any>;

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    this.updateView();
  }

  
  private updateView() {
    const required = Array.isArray(this.requiredPermissions)
      ? this.requiredPermissions
      : [this.requiredPermissions];

    const hasPermission = required.some(pKey =>
      this.authService.hasPermission(pKey)
    );

    this.viewContainer.clear();

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.elseTemplate) {
      this.viewContainer.createEmbeddedView(this.elseTemplate);
    }
  }
}

/* <!-- Only users with APPOINTMENT_UPDATE see this -->
<button *appHasPermission="'APPOINTMENT_UPDATE'">Edit Appointment</button>
 */