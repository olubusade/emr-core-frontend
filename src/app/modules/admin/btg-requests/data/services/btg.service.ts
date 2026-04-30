import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/service/base-api-service';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { BtgRequest } from '../interfaces/btg.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BtgService extends BaseApiService {
  private baseUrl = `${environment.apiUrl}/btg`;

  constructor(http: HttpClient) {
    super(http);
  }

  // =========================
  // PATIENT HISTORY SIDE
  // =========================
  requestBTG(payload: BtgRequest): Observable<any> {
    return this.post(`${this.baseUrl}/request`, payload);
  }

  /**
   * GET ACTIVE BTG FOR PATIENT + USER
   */
  getActiveBTG(patientId: string): Observable<any> {
    return this.get(`${this.baseUrl}/${patientId}/active`);
  }

  // =========================
  // ADMIN SIDE
  // =========================

  getBTGRequests(params?: any): Observable<any>  {
    return this.get(this.baseUrl, { params });
  }
  approveBTG(id: string, payload: { decisionReason: string }) {
  return this.patch(`${this.baseUrl}/${id}/approve`, payload);
  }

  rejectBTG(id: string, payload: { decisionReason: string }) {
    return this.patch(`${this.baseUrl}/${id}/reject`, payload);
  }

  expireBTG(id: string, payload: { decisionReason: string }) {
    return this.patch(`${this.baseUrl}/${id}/revoke`, payload);
  }
  
}