import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IClinicalNote } from '../interfaces/clinical-note.interface';

@Injectable({
  providedIn: 'root'
})
export class ClinicalService {
  private baseUrl = `${environment.apiUrl}/clinical`;

  constructor(private http: HttpClient) {}

  /**
   * Get all clinical history for a specific patient
   */
  getNotesByPatient(patientId: string): Observable<IClinicalNote[]> {
    return this.http.get<{ data: IClinicalNote[] }>(`${this.baseUrl}/patient/${patientId}`)
      .pipe(map(response => response.data));
  }

  /**
   * Get the note for a specific appointment session
   */
  getNoteByAppointment(appointmentId: string): Observable<IClinicalNote> {
    return this.http.get<{ data: IClinicalNote }>(`${this.baseUrl}/appointment/${appointmentId}`)
      .pipe(map(response => response.data));
  }

  /**
   * Save or Update a clinical note
   */
  saveNote(note: IClinicalNote): Observable<any> {
    // If ID exists, it's an update, otherwise it's a create
    if (note.id) {
      return this.http.put(`${this.baseUrl}/${note.id}`, note);
    }
    return this.http.post(this.baseUrl, note);
  }
}