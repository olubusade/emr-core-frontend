import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";

import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";

import { MAT_DATE_LOCALE } from "@angular/material/core";
import { formatDate } from "@angular/common";
import { AppointmentService } from "src/app/features/schedule/data/services/appointment.service";



@Component({
  selector: 'app-book-appt-form-dialog',
  templateUrl: './book-appt-form-dialog.component.html',
  styleUrls: ['./book-appt-form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class BookApptFormDialogComponent {
  action: string;
  dialogTitle: string;
  appointmentForm: FormGroup;
  appointment: any;
  constructor(
    public dialogRef: MatDialogRef<BookApptFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public appointmentService: AppointmentService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      console.log(data.appointment.date);
      this.dialogTitle = data.appointment.doctor;
      this.appointment = data.appointment;
    } else {
      this.dialogTitle = "New Appointment";
    //  this.appointment = new UpcomingAppointment({});
    }
    this.appointmentForm = this.createContactForm();
  }
  formControl = new FormControl("", [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }
  createContactForm(): FormGroup {
    return this.fb.group({
      id: [this.appointment.id],
      img: [this.appointment.img],
      email: [
        this.appointment.email,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      date: [
        formatDate(this.appointment.date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      time: [this.appointment.time, [Validators.required]],
      mobile: [this.appointment.mobile, [Validators.required]],
      doctor: [this.appointment.doctor, [Validators.required]],
      injury: [this.appointment.injury],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
   /*  this.appointmentService.addUpcomingAppointment(
      this.appointmentForm.getRawValue()
    ); */
  }
}
