import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IVital, IVitalCreateDTO, IVitalUpdateDTO } from '../interfaces/vital.interface';

@Injectable({
  providedIn: 'root'
})
export class VitalService {
  private readonly baseUrl = `${environment.apiUrl}/vitals`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches vitals specifically for one appointment.
   * Used to check if vitals were already taken.
   */  
  getVitalsByPatient(patientId: string): Observable<IVital[]> {
    return this.http.get<IVital[]>(`${this.baseUrl}/patient/${patientId}`);
  }
  getVitalsByAppointment(appointmentId: string, patientId: string): Observable<IVital[]> {
    // 1. Create the query parameters
    const params = new HttpParams().set('patientId', patientId);

    // 2. Pass them in the options object
    return this.http.get<IVital[]>(`${this.baseUrl}/appointment/${appointmentId}`, { params });
}
  listVitals(params: any): Observable<{ items: IVital[], total: number }> {
    return this.http.get<{ items: IVital[], total: number }>(this.baseUrl, { params });
  }
  getVital(vitalId: string): Observable<IVital[]> {
    return this.http.get<IVital[]>(`${this.baseUrl}/${vitalId}`);
  }
  createVital(vital: IVitalCreateDTO): Observable<IVital> {
    return this.http.post<IVital>(this.baseUrl, vital);
  }

  updateVital(id: string, updates: IVitalUpdateDTO): Observable<IVital> {
    return this.http.put<IVital>(`${this.baseUrl}/${id}`, updates);
  }

  deleteVital(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}