import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { API_CONSTANTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = API_CONSTANTS.BASE_URL;

  constructor(private http: HttpClient) {}

  getAppointments(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    department?: string;
    status?: string;
    sortField?: string;
    sortOrder?: string;
  }): Observable<any> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.department) httpParams = httpParams.set('department', params.department);
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.sortField) httpParams = httpParams.set('sortField', params.sortField);
      if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    }

    return this.http.get(`${this.baseUrl}${API_CONSTANTS.APPOINTMENTS.GET_ALL}`, { params: httpParams });
  }

  getAppointmentById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_CONSTANTS.APPOINTMENTS.GET_BY_ID(id)}`);
  }

  createAppointment(appointment: Appointment): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_CONSTANTS.APPOINTMENTS.CREATE}`, appointment);
  }

  updateAppointment(id: number, appointment: Appointment): Observable<any> {
    return this.http.put(`${this.baseUrl}${API_CONSTANTS.APPOINTMENTS.UPDATE(id)}`, appointment);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${API_CONSTANTS.APPOINTMENTS.DELETE(id)}`);
  }

  getDoctors(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_CONSTANTS.DOCTORS.GET_ALL}`);
  }
}
