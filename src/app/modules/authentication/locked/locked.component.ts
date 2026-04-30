import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { Role } from "src/app/core/domain/enum/role.enum";
@Component({
  selector: "app-locked",
  templateUrl: "./locked.component.html",
  styleUrls: ["./locked.component.scss"],
})
export class LockedComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  userImg: string;
  userFullName: string;
  hide = true;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      password: ["", Validators.required],
    });
    this.userImg = "";
    this.userFullName =
      this.authService.currentUserValue.user.fullName;
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      const currentUser = this.authService.currentUserValue?.user;
      if (!currentUser) return;
      const userRoles: string[] = currentUser.roles; // array of roles
      if (userRoles.includes(Role.Admin)) {
        this.router.navigate(["/admin/dashboard/main"]);
      }    
      else if (userRoles.includes(Role.Doctor)) {
        this.router.navigate(["/doctor/dashboard"]);
      } else if (userRoles.includes(Role.Nurse)) {
        this.router.navigate(["/nurse/dashboard"]);
      }
      else if (userRoles.includes(Role.Patient)) {
        this.router.navigate(["/patient/dashboard"]);
      }
      else if (userRoles.includes(Role.Receptionist)) {
        this.router.navigate(["/patient-access/dashboard"]);
      }
       else {
        this.router.navigate(["/auth/signin"]);
      }
    }
  }
}
