import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseApiService } from 'src/app/core/service/base-api-service';
import { Patient } from '../models/patient.model';
import { PatientListItem, IPatientListParams, IPatientResponse, IPatientCreateDTO, IPatientUpdateDTO } from '../interfaces/patient.interface';

@Injectable({ providedIn: 'root' })
export class PatientService extends BaseApiService {
  private baseUrl = `${environment.apiUrl}/patients`;
  public dataChange: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);

  constructor(http: HttpClient) { super(http); }

  get data(): Patient[] { return this.dataChange.value; }

  /** Fetch all patients and update BehaviorSubject */
  getAllPatients(): void {
    this.http.get<IPatientResponse[]>(this.baseUrl)
      .pipe(map(res => (res ?? []).map(Patient.fromApi)))
      .subscribe({
        next: patients => this.dataChange.next(patients),
        error: err => console.error('Failed to fetch patients', err)
      });
  }

  /** Paginated/filtered patient list */
 listPatients(
  params: IPatientListParams = {}
): Observable<{
  items: PatientListItem[];
  page: number;
  pages: number;
  total: number;
}> {

  let httpParams = new HttpParams();

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      httpParams = httpParams.set(k, String(v));
    }
  });

  return this.get<any>(this.baseUrl, httpParams).pipe(

    map(res => {
      const data = res?.data ?? [];
      const meta = res?.meta ?? {};

      return {
        items: data.map(Patient.fromApiToListItem),
        page: meta.page ?? 1,
        pages: meta.pages ?? 1,
        total: meta.total ?? data.length
      };
    })
  );
}

  /** GET patient by ID */
  getPatientById(id: string): Observable<Patient> {
  return this.get<{ status: string; message: string; data: IPatientResponse }>(
    `${this.baseUrl}/${id}`
  ).pipe(
    map(res => Patient.fromApi(res.data))
  );
}

  /** CREATE patient */
  createPatient(data: IPatientCreateDTO): Observable<Patient> {
    return this.post<IPatientResponse>(this.baseUrl, data).pipe(map(Patient.fromApi));
  }

  /** UPDATE patient */
  updatePatient(id: string, data: IPatientUpdateDTO): Observable<Patient> {
    return this.put<IPatientResponse>(`${this.baseUrl}/${id}`, data).pipe(map(Patient.fromApi));
  }

  /** DELETE patient */
  deletePatient(id: string): Observable<void> {
    return this.delete<void>(`${this.baseUrl}/${id}`);
  }
}