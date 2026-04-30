import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Page404Component } from '../../modules/authentication/page404/page404.component';
import { AuthGuard } from '../../core/guard/auth.guard';
import { Role } from '../../core/domain/enum/role.enum';
import { AppointmentDetailComponent } from './components/appointment-detail/appointment-detail.component';
import { BookappointmentComponent } from './components/bookappointment/bookappointment.component';
import { PastAppointmentComponent } from './components/past-appointment/past-appointment.component';
import { TodayAppointmentComponent } from './components/today-appointment/today-appointment.component';
import { UpcomingAppointmentComponent } from './components/upcoming-appointment/upcoming-appointment.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      roles: [Role.SuperAdmin, Role.Admin, Role.Receptionist]
     }, // restrict who can see appointments
    children: [

      {
        path: 'view/:id',
        component: AppointmentDetailComponent,
        data: { permissions: ['APPOINTMENT_READ'] },
      }
    ]
  },
  {
    path: "book",
    component: BookappointmentComponent,
  },
  {
    path: "edit/:id",
    component: BookappointmentComponent,
  },
  {
    path: "today",
    component: TodayAppointmentComponent,
  },
  {
    path: "upcoming",
    component: UpcomingAppointmentComponent,
  },
  {
    path: "past",
    component: PastAppointmentComponent,
  },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule {}
