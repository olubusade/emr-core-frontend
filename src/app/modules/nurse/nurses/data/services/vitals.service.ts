import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IVital } from '../../../vitals/data/interfaces/vital.interface';

// --- Vital Signs Interfaces ---
export interface Vitals {
  id: string; // UUID string based on your path parameter schema
  patientId: string; // UUID of the patient
  staffId: string; // UUID of the staff member who recorded it
  recordedAt: string; // ISO date/time string
  temperatureCelsius: number;
  heartRateBPM: number;
  respiratoryRateBPM: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenSaturation: number; // Percentage
  weightKG: number;
  heightCM: number;
  notes?: string;
}

// Interface for creating a vital record (ID and recordedAt are often set by backend)
export interface CreateVitals extends Omit<Vitals, 'id' | 'recordedAt' | 'staffId'> {
  // staffId might be derived from the JWT, but keeping it optional for flexibility
  staffId?: string;
}

// Interface for updating a vital record (all fields are optional)
export interface UpdateVitals extends Partial<CreateVitals> {}

// Interface for listing vitals (allows for filters)
export interface ListVitalsParams {
  patientId?: string; // Filter notes by a specific patient
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class VitalsService {
  private apiUrl = `${environment.apiUrl}/vitals`;

  constructor(private http: HttpClient) {}

  // -------------------- 1. LIST VITALS (GET /vitals) --------------------
  /**
   * Retrieves a list of vital records, typically filtered by patientId.
   * Corresponds to: GET /vitals?patientId={id}
   */
  listVitals(params: ListVitalsParams = {}): Observable<Vitals[]> {
    let httpParams = new HttpParams();

    // Map the optional filters to HttpParams
    if (params.patientId) httpParams = httpParams.set('patientId', params.patientId);
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    
    return this.http.get<Vitals[]>(this.apiUrl, { params: httpParams });
  }

  // -------------------- 2. CREATE VITAL RECORD (POST /vitals) --------------------
  /**
   * Creates a new vital sign record for a patient.
   * Corresponds to: POST /vitals
   */
  createVital(vitalsData: CreateVitals): Observable<Vitals> {
    return this.http.post<Vitals>(this.apiUrl, vitalsData);
  }

  // -------------------- 3. GET SINGLE VITAL RECORD (GET /vitals/{id}) --------------------
  /**
   * Retrieves a single vital record by its UUID.
   * Corresponds to: GET /vitals/{id}
   */
  getVital(id: string): Observable<Vitals> {
    return this.http.get<Vitals>(`${this.apiUrl}/${id}`);
  }

  // -------------------- 4. UPDATE VITAL RECORD (PUT /vitals/{id}) --------------------
  /**
   * Updates an existing vital record by its UUID.
   * Corresponds to: PUT /vitals/{id}
   */
  updateVital(id: string, updateData: UpdateVitals): Observable<Vitals> {
    return this.http.put<Vitals>(`${this.apiUrl}/${id}`, updateData);
  }

  // -------------------- 5. DELETE VITAL RECORD (DELETE /vitals/{id}) --------------------
  /**
   * Deletes a vital record by its UUID.
   * Corresponds to: DELETE /vitals/{id}
   */
  deleteVital(id: string): Observable<void> {
    // DELETE typically returns a 204 No Content
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

   // -------------------- 6.  VITAL BY APPOINTMENT RECORD (GET /vitals/appointment/{appointmentId}) --------------------
  /**
   * Retrieves vital records for a specific patient.
   *  Corresponds to: GET /vitals/patient/{patientId}
   */

  getVitalsByAppointment(appointmentId: string, patientId: string): Observable<IVital[]> {
    // 1. Create the query parameters
    const params = new HttpParams().set('patientId', patientId);
    // 2. Pass them in the options object
    return this.http.get<IVital[]>(`${this.apiUrl}/appointment/${appointmentId}`, { params });
  }

   // -------------------- 7.  VITAL BY PATIENT RECORD (GET /vitals/patient/{patientId}) --------------------
  /**
   * Retrieves vital records for a specific patient.
   *  Corresponds to: GET /vitals/patient/{patientId}
   */

  getVitalsByPatient(patientId: string): Observable<Vitals[]> {
    return this.http.get<Vitals[]>(`${this.apiUrl}/patient/${patientId}`);
  }
}