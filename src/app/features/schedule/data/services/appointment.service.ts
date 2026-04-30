// src/app/features/schedule/data/services/appointment.service.ts (Updated)

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { BaseApiService } from 'src/app/core/service/base-api-service';

// 🔑 Assuming these interfaces and models exist in your project structure

import { BaseAppointmentListParams, IApiResponse, IAppointmentCreateDTO, IAppointmentListModel, IAppointmentListResponse, IAppointmentResponse, IAppointmentUpdateDTO } from '../interfaces/appointment.interface';
import { Appointment } from '../models/appointment.model';



@Injectable({ providedIn: 'root' })
export class AppointmentService extends BaseApiService {
    private baseUrl = `${environment.apiUrl}/appointments`;

    constructor(http: HttpClient) {
        super(http);
    }

    /**
     * 1. Retrieves a list of appointments with optional filtering/pagination. (EXISTING)
     */
 public listAppointments(
  params: BaseAppointmentListParams
): Observable<IAppointmentListModel> {

  return this.get<IAppointmentListResponse>(this.baseUrl, params).pipe(

    map((response: any) => {

      // ✅ correct extraction
      const data = response?.data;

      const items = data?.items ?? [];

      const mappedItems = items.map((item: any) =>
        Appointment.fromApi(item)
      );

      return {
        items: mappedItems,
        total: data?.total ?? 0,
        page: data?.page ?? params.page,
        pages: data?.pages ?? 0
      } as IAppointmentListModel;
    })
  );
}

    /**
     * 2. Retrieves a single appointment by ID. (EXISTING)
     */
    getAppointment(id: string): Observable<Appointment> {
        return this.get<IApiResponse<IAppointmentResponse>>(`${this.baseUrl}/${id}`).pipe(
            map(res => Appointment.fromApi(res.data))
        );
    }

    /**
     * 3. 🔑 NEW: Creates a new appointment (C of CRUD).
     */
    public createAppointment(data: IAppointmentCreateDTO): Observable<Appointment> {
        return this.post<IAppointmentResponse>(this.baseUrl, data).pipe(
            map(Appointment.fromApi)
        );
    }

    /**
     * 4. 🔑 NEW: Updates an existing appointment (U of CRUD).
     */
    public updateAppointment(id: string, data: IAppointmentUpdateDTO): Observable<Appointment> {
        return this.put<IAppointmentResponse>(`${this.baseUrl}/${id}`, data).pipe(
            map(Appointment.fromApi)
        );
    }

    /**
     * 5. 🔑 NEW: Deletes/Cancels an appointment (D of CRUD).
     */
    public deleteAppointment(id: string): Observable<void> {
        // Assuming delete returns a successful empty response (void)
        return this.delete<void>(`${this.baseUrl}/${id}`);
    }
    
    /**
     * 6. 🔑 NEW: Handles specific status changes (e.g., Check-In, Complete).
     * Used typically by Receptionists or Doctors.
     */
    public updateAppointmentStatus(id: string, newStatus: string): Observable<Appointment> {
        // Use a dedicated patch endpoint for state changes
        const data = { status: newStatus };
        return this.patch<IAppointmentResponse>(`${this.baseUrl}/${id}/status`, data).pipe(
            map(Appointment.fromApi)
        );
    }
}