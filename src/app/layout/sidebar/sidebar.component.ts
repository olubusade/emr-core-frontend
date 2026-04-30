import { Router, NavigationEnd } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from "@angular/core";
import { ROUTES } from "./sidebar-items";
import { AuthService } from "src/app/core/service/auth.service";
import { environment } from "src/environments/environment";
import { RouteInfo } from "./sidebar.metadata";
import { Role } from "src/app/core/domain/enum/role.enum";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.sass"],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public sidebarItems: RouteInfo[] = [];
  level1Menu = "";
  level2Menu = "";
  level3Menu = "";
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  userFullName: string;
  userImg: string;
  userType: string;
  designation: string;
  headerHeight = 60;
  currentRoute: string;
  routerObj: any = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar

  ) {
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const roleModules = [
          "superadmin",
          "admin",
          "doctor",
          "patient",
          "nurse",
          "receptionist"
        ];
        const currenturl = event.url.split("?")[0];
        const firstString = currenturl.split("/").slice(1)[0];

        if (roleModules.indexOf(firstString) !== -1) {
          this.level1Menu = event.url.split("/")[2];
          this.level2Menu = event.url.split("/")[3];
        } else {
          this.level1Menu = event.url.split("/")[1];
          this.level2Menu = event.url.split("/")[2];
        }

        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, "overlay-open");
      }
    });
  }

  @HostListener("window:resize", ["$event"])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }

  @HostListener("document:mousedown", ["$event"])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, "overlay-open");
    }
  }

  // ---------------- TOGGLE MENUS ----------------
  callLevel1Toggle(event: any, element: any) {
    this.level1Menu = element === this.level1Menu ? "0" : element;
  }

  callLevel2Toggle(event: any, element: any) {
    this.level2Menu = element === this.level2Menu ? "0" : element;
  }

  callLevel3Toggle(event: any, element: any) {
    this.level3Menu = element === this.level3Menu ? "0" : element;
  }

  ngOnInit(): void {
    const current = this.authService.currentUserValue;
    if (!current?.user) {
      // not logged in (or no user) — still initialize visuals and return
      this.initLeftSidebar();
      this.bodyTag = this.document.body;
      return;
    }
  
    // normalize role & permission arrays to UPPERCASE strings
    const userRolesRaw = this.authService.getUserRoles() || [];        // e.g. ['admin']
    const userPermissionsRaw = this.authService.getUserPermissions() || []; // e.g. ['USER_READ']
  
    const userRoles = userRolesRaw.map(r => String(r).toUpperCase());
    const userPermissions = userPermissionsRaw.map(p => String(p).toUpperCase());
  
  
    this.userFullName = current.user.fullName || `${current.user.fName || ''} ${current.user.lName || ''}`;
    this.designation = current.user.designation;
    
    this.userImg = environment.avatarImage || '../../../assets/images/avatar.png';
  
    // SUPERADMIN sees everything
    if (userRoles.includes('SUPERADMIN')) {
      // clone ROUTES so we don't mutate original metadata
      this.sidebarItems = ROUTES.map(r => ({ ...r, submenu: (r.submenu || []).slice() }));
    } else {
      // 1) Role filter: keep items that either:
      //    - have no roles (public candidate), or
      //    - include at least one of the user's roles, or
      //    - are groupTitle entries
      const roleFiltered = ROUTES.filter(route => {
        if (route.groupTitle) return true;
  
        const routeRoles = Array.isArray((route as any).roles) ? (route as any).roles.map((v: any) => String(v).toUpperCase()) : [];
        if (routeRoles.length === 0) return true; // candidate for permission-based display
        return routeRoles.some(rr => userRoles.includes(rr));
      });
  
      console.log('roleFiltered count:', roleFiltered.length, roleFiltered);
  
      // 2) Permission filter: only remove items that require a permission AND
      //    the user does NOT have it. However, if the route is explicitly assigned
      //    to the user's role (handled above), we keep it regardless of permissionKey.
      this.sidebarItems = this.filterByRoleAndPermissions(roleFiltered, userRoles, userPermissions);
    }
  
    // map a userType string for display
    if (userRoles.includes('SUPERADMIN')) this.userType = Role.SuperAdmin;
    else if (userRoles.includes('ADMIN')) this.userType = Role.Admin;
    else if (userRoles.includes('DOCTOR')) this.userType = Role.Doctor;
    else if (userRoles.includes('NURSE')) this.userType = Role.Nurse;
    else if (userRoles.includes('RECEPTIONIST')) this.userType = Role.Receptionist;
    else if (userRoles.includes('PATIENT')) this.userType = Role.Patient;
    else this.userType = userRoles[0] || Role.Admin;
  
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }
  
  /**
   * Recursively keep a route if:
   *  - it's a groupTitle OR
   *  - the route was explicitly assigned to a user's role (route.roles intersects userRoles) OR
   *  - it has no role assignment but the user has the required permission (route.permissionKey in userPermissions) OR
   *  - any of its submenu children survived the filter
   */
  private filterByRoleAndPermissions(routes: RouteInfo[], userRoles: string[], userPermissions: string[]): RouteInfo[] {
    return routes
      .map(route => {
        // normalize route roles and permission key
        const routeRoles = Array.isArray((route as any).roles) ? (route as any).roles.map((v: any) => String(v).toUpperCase()) : [];
        const permissionKey = (route as any).permissionKey ? String((route as any).permissionKey).toUpperCase() : null;
  
        // filter children first
        const children = Array.isArray(route.submenu) ? this.filterByRoleAndPermissions(route.submenu, userRoles, userPermissions) : [];
  
        const isGroup = !!route.groupTitle;
  
        const allowedByRole = routeRoles.length > 0 && routeRoles.some(rr => userRoles.includes(rr));
        const allowedByPermission = !permissionKey || userPermissions.includes(permissionKey);
  
        // Decision: show when groupTitle OR allowedByRole OR (no role assigned && allowedByPermission) OR has children
        const hasNoRolesAssigned = routeRoles.length === 0;
        const show = isGroup || allowedByRole || (hasNoRolesAssigned && allowedByPermission) || (children && children.length > 0);
  
        if (!show) return null;
  
        // return shallow clone to avoid mutating original ROUTES
        return {
          ...route,
          roles: routeRoles, // normalized
          permissionKey: permissionKey || undefined,
          submenu: children
        } as RouteInfo;
      })
      .filter((r): r is RouteInfo => r != null);
  }
  
  

  // ---------------- CLEANUP ----------------
  ngOnDestroy() {
    this.routerObj.unsubscribe();
  }

  // ---------------- UI HELPERS ----------------
  initLeftSidebar() {
    this.setMenuHeight();
    this.checkStatuForResize(true);
  }

  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + "";
    this.listMaxWidth = "500px";
  }

  isOpen() {
    return this.bodyTag.classList.contains("overlay-open");
  }

  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, "ls-closed");
    } else {
      this.renderer.removeClass(this.document.body, "ls-closed");
    }
  }

  mouseHover(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("submenu-closed")) {
      this.renderer.addClass(this.document.body, "side-closed-hover");
      this.renderer.removeClass(this.document.body, "submenu-closed");
    }
  }

  mouseOut(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("side-closed-hover")) {
      this.renderer.removeClass(this.document.body, "side-closed-hover");
      this.renderer.addClass(this.document.body, "submenu-closed");
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: (res) => console.log("Logout successful", res),
      error: (err) => {
        console.error("Logout failed", err)
        this.snackBar.open(err?.message || 'Logout failed', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
    }
    });
  }
}
