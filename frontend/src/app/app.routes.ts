import { Routes } from '@angular/router';
import { AppointmentListComponent } from './features/appointments/pages/appointment-list/appointment-list.component';
import { AddAppointmentComponent } from './features/appointments/pages/add-appointment/add-appointment.component';
import { EditAppointmentComponent } from './features/appointments/pages/edit-appointment/edit-appointment.component';
import { AppointmentDetailsComponent } from './features/appointments/pages/appointment-details/appointment-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'appointments', pathMatch: 'full' },
  { path: 'appointments', component: AppointmentListComponent },
  { path: 'appointments/add', component: AddAppointmentComponent },
  { path: 'appointments/edit/:id', component: EditAppointmentComponent },
  { path: 'appointments/view/:id', component: AppointmentDetailsComponent }
];
