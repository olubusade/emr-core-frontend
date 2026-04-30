import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { Role } from "src/app/core/domain/enum/role.enum";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { ToastService } from "src/app/core/service/toast.service";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  authForm: FormGroup;
  submitted = false;
  loading = false;
  error = "";
  hide = true;
  appName: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.appName = environment.appName;
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    
    //this.toastService.success('Your data has been saved successfully.', 'Data Saved');

    this.superAdminSet();
  }
  get f() {
    return this.authForm.controls;
  }

  superAdminSet(){
    this.authForm.get("email").setValue("systemadmin@busade-emr-demo.com");
    this.authForm.get("password").setValue("superadmin@123");
  }
  adminSet() {
    this.authForm.get("email").setValue("hospitaladmin@busade-emr-demo.com");
    this.authForm.get("password").setValue("admin@123");
  }
  receptionistSet() {
    this.authForm.get("email").setValue("frontdesk@busade-emr-demo.com");
    this.authForm.get("password").setValue("reception@123");
  }
  doctorSet() {
    this.authForm.get("email").setValue("physician@busade-emr-demo.com");
    this.authForm.get("password").setValue("doctor@123");
  }
  patientSet() {
    this.authForm.get("email").setValue("patient@busade-emr-demo.com");
    this.authForm.get("password").setValue("patient@123");
  }
  nurseSet() {
    this.authForm.get("email").setValue("nurse@busade-emr-demo.com");
    this.authForm.get("password").setValue("nurse@123");
  }
  
  onSubmit() {
  this.submitted = true;
  this.loading = true;
  this.error = "";

  if (this.authForm.invalid) {
    this.error = "Email and password are required";
    this.loading = false;
    return;
  }

  this.subs.sink = this.authService
    .login(this.f.email.value, this.f.password.value)
    .subscribe({
      next: (res) => {
        if (!res) {
          this.error = "Invalid login credentials";
          this.loading = false;
          return;
        }

        // Optional debug (keep in demo)
        if (!environment.production) {
          console.warn("Login Response:", res);
          console.warn(
            "User Roles:",
            this.authService.currentUserValue?.user?.roles
          );
        }

        /**
         * SINGLE ENTRY POINT
         * Role-based dashboard rendering happens INSIDE the dashboard module
         */
        setTimeout(() => {
          this.router.navigate(["/dashboard"]);
          this.loading = false;
        }, 300);
      },

      error: (err) => {
        this.error = err?.message || "Login failed. Please try again.";
        this.submitted = false;
        this.loading = false;
      },
    });
}

  
}
