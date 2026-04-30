import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "./modules/authentication/page404/page404.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { Role } from "./core/domain/enum/role.enum"; // Assuming this enum is correct
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./layout/app-layout/main-layout/main-layout.component";
import { RoleGuard } from "./core/guard/role.guard";

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./modules/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard], // 1. Always check login first
    children: [
      // ----------------------------------------------------------------------
      // 2. DEFAULT REDIRECT AFTER LOGIN (ALL STAFF/PATIENT)
      // The AuthService should redirect here immediately after login success.
      // The DashboardRootComponent handles rendering the correct view.
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      
      // ----------------------------------------------------------------------
      // 3. UNIFIED FEATURE MODULES (Replaced all old role modules)
      
      // DASHBOARD: Accessible by everyone, content filtered by role inside the module.
      {
        path: 'dashboard',
        // The RoleGuard here ensures only these roles can access the dashboard route at all.
        canActivate: [RoleGuard], 
        data: { roles: [Role.SuperAdmin,Role.Admin, Role.Doctor, Role.Nurse, Role.Receptionist, Role.Patient] }, 
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },      
      // SCHEDULE/APPOINTMENTS: Unified module, access for staff dealing with booking/calendar.
      {
        path: 'appointments', // Using 'schedule' for clarity, but works with 'appointment'
        canActivate: [RoleGuard],
        data: { roles: [Role.SuperAdmin,Role.Admin, Role.Doctor, Role.Nurse, Role.Receptionist] },
        loadChildren: () =>
          import('./features/schedule/schedule.module').then((m) => m.ScheduleModule),
      },      
      // PATIENT CHART: Clinical records access (Doctor/Nurse/Admin)
      {
        path: 'patients', // Route for Patient Chart/List
        canActivate: [RoleGuard],
        data: { roles: [Role.SuperAdmin,Role.Admin, Role.Doctor, Role.Nurse, Role.Receptionist] },
        loadChildren: () =>
          import('./features/patient-chart/patients.module').then((m) => m.PatientsModule),
      },
      // NURSE: Vitals capture (Nurse)
      {
        path: 'nurse', // Route for Nurse Vitals
        canActivate: [RoleGuard],
        data: { roles: [Role.SuperAdmin,Role.Admin, Role.Nurse] },
        loadChildren: () =>
          import('./modules/nurse/nurse.module').then((m) => m.NurseModule),
      },  
       // DOCTOR: Clinical capture (Doctor)
      {
        path: 'doctor', // Route for Nurse Vitals
        canActivate: [RoleGuard],
        data: { roles: [Role.SuperAdmin,Role.Admin, Role.Doctor] },
        loadChildren: () =>
          import('./modules/doctor/doctor.module').then((m) => m.DoctorModule),
      },  
      // PERSONNEL/DIRECTORY: Staff lookup for all staff roles.
      {
        path: 'personnel',
        canActivate: [RoleGuard],
        data: { roles: [Role.SuperAdmin,Role.Admin, Role.Doctor, Role.Nurse, Role.Receptionist] },
        loadChildren: () =>
          import('./features/personnel/components/staff.module').then((m) => m.StaffModule),
      },      
      // BILLING: Financial workflows.
      {
        path: 'billing',
        canActivate: [RoleGuard],
        data: { roles: [Role.SuperAdmin,Role.Admin, Role.Receptionist] },
        loadChildren: () =>
          import('./features/billing/billing.module').then((m) => m.BillingModule),
      },  
      // ADMIN: System configuration (highest security).
      {
        path: 'admin-config', // Use 'admin-config' or 'system' to avoid conflict with old module
        canActivate: [RoleGuard], 
        data: { roles: [Role.Admin, Role.SuperAdmin] }, 
        loadChildren: () =>
          import('./modules/admin/admin.module').then((m) => m.AdminModule),
      },  
      // PATIENT PORTAL: External patient features (billing, records view)
      {
        path: 'portal', 
        canActivate: [RoleGuard],
        data: { roles: [Role.Patient] },
        loadChildren: () =>
          import('./modules/patient-portal/patient.module').then((m) => m.PatientModule),
      },
      // ACCOUNT/PROFILE: Global settings for the current user.
      {
        path: 'account', 
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.SuperAdmin] }, 
        loadChildren: () =>
          import('./features/account/components/account.module').then((m) => m.AccountModule),
      },
      
      // ----------------------------------------------------------------------
      // 4. OLD MODULE CLEANUP & FALLBACK
      // { path: 'redirect', canActivate: [AuthGuard], component: Page404Component }, // Not needed if default is dashboard
      { path: '**', component: Page404Component },
    ],
  },
  { path: '**', component: Page404Component },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "corrected" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}