import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit
} from '@angular/core';
import { AuthService } from '../service/auth.service';

@Directive({ selector: '[appHasRole]' })
export class HasRoleDirective implements OnInit {
  private hasView = false;

  @Input('appHasRole') roles: string[] = [];
  @Input('appHasRoleElse') elseTemplate?: TemplateRef<any>;

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
     const userRoles = (this.authService.getUserRoles() || []).map(r => r.toLowerCase());

    const hasRole = this.roles.some(r =>
      userRoles.includes(r.toLowerCase())
    );

    this.viewContainer.clear();

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.elseTemplate) {
      this.viewContainer.createEmbeddedView(this.elseTemplate);
    }
  }
}

/* <!-- Only Admins or Doctors see this -->
<div *appHasRole="['Admin','Doctor']">
  Special doctor tools here
</div> */