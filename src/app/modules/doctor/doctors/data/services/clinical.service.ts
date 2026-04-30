import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IClinicalNote } from '../../../clinical-notes/data/interfaces/clinical-note.interface';


@Injectable({
  providedIn: 'root'
})
export class ClinicalService {
  private baseUrl = `${environment.apiUrl}/clinical`;

  constructor(private http: HttpClient) {}

  /**
   * List all clinical notes with optional filters (patientId, staffId)
   */
  listClinicalNotes(filters?: { patientId?: string; staffId?: string }): Observable<IClinicalNote[]> {
    let params = new HttpParams();
    if (filters?.patientId) params = params.append('patientId', filters.patientId);
    if (filters?.staffId) params = params.append('staffId', filters.staffId);

    return this.http.get<{ data: IClinicalNote[] }>(this.baseUrl, { params })
      .pipe(map(response => response.data));
  }

  /**
   * Get clinical history for a specific patient
   * Endpoint: GET /clinical/patient/:patientId
   */
  getClinicalNotesByPatientId(patientId: string): Observable<IClinicalNote[]> {
    return this.http.get<{ data: IClinicalNote[] }>(`${this.baseUrl}/patient/${patientId}`)
      .pipe(map(response => response.data));
  }

  /**
   * Get the clinical note for a specific appointment session
   * Endpoint: GET /clinical/appointment/:appointmentId
   */
  getClinicalNotesByAppointment(appointmentId: string,patientId:string): Observable<IClinicalNote | null> {
    // 1. Create the query parameters
        const params = new HttpParams().set('patientId', patientId);
        // 2. Pass them in the options object
        return this.http.get<{ data: IClinicalNote }>(`${this.baseUrl}/appointment/${appointmentId}`, { params })
        .pipe(map(response => response.data || null));
  }

  /**
   * Get a single clinical note by its ID
   * Endpoint: GET /clinical/:id
   */
  getClinicalNoteById(id: string): Observable<IClinicalNote> {
    return this.http.get<{ data: IClinicalNote }>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  /**
   * Create a new clinical note
   * Endpoint: POST /clinical
   */
  createClinicalNote(note: Partial<IClinicalNote>): Observable<IClinicalNote> {
    return this.http.post<{ data: IClinicalNote }>(this.baseUrl, note)
      .pipe(map(response => response.data));
  }

  /**
   * Update an existing clinical note
   * Endpoint: PUT /clinical/:id
   */
  updateClinicalNote(id: string, note: Partial<IClinicalNote>): Observable<IClinicalNote> {
    return this.http.put<{ data: IClinicalNote }>(`${this.baseUrl}/${id}`, note)
      .pipe(map(response => response.data));
  }

  /**
   * Delete a clinical note
   * Endpoint: DELETE /clinical/:id
   */
  deleteClinicalNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Helper method to handle Save vs Update logic automatically
   */
  upsertClinicalNote(note: Partial<IClinicalNote>): Observable<IClinicalNote> {
    if (note.id) {
      return this.updateClinicalNote(note.id, note);
    }
    return this.createClinicalNote(note);
  }
}