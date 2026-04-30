import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Define Audit Log interfaces based on your Swagger documentation
export interface AuditLog {
  id: number;
  userId: number;
  action: string; // e.g., 'PATIENT_CREATE', 'LOGIN'
  entityType: string; // e.g., 'Patient', 'Appointment'
  entityId: string | number; // ID of the affected entity
  timestamp: string; // ISO date string
  ipAddress: string;
  // payload/details property might be included for more context
}

export interface AuditListResponse {
  items: AuditLog[];
  page: number;
  pages: number;
  total: number;
}

export interface AuditListParams {
  page?: number;
  limit?: number;
  userId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private apiUrl = `${environment.apiUrl}/audits`;

  constructor(private http: HttpClient) {}

  // -------------------- 1. LIST AUDIT LOGS (GET /audits) --------------------
  /**
   * Retrieves a paginated and optionally filtered list of audit logs.
   * Corresponds to: GET /audits
   */
  listAudits(params: AuditListParams = {}): Observable<AuditListResponse> {
    let httpParams = new HttpParams();

    // Set default pagination parameters if not provided
    const page = params.page !== undefined ? params.page : 1;
    const limit = params.limit !== undefined ? params.limit : 20;

    httpParams = httpParams.set('page', page.toString());
    httpParams = httpParams.set('limit', limit.toString());
    
    // Add optional userId filter
    if (params.userId !== undefined) {
      httpParams = httpParams.set('userId', params.userId.toString());
    }

    return this.http.get<AuditListResponse>(this.apiUrl, { params: httpParams });
  }

  // NOTE: This service is intentionally read-only as audit logs should not be created,
  // updated, or deleted directly by the frontend. These actions are handled exclusively 
  // by the backend's internal logging middleware/logic.
}