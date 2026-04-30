import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/service/base-api-service';
import { environment } from 'src/environments/environment';
import { IAuditParams, IAuditResponse } from '../interfaces/audit.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuditService extends BaseApiService {
  private baseUrl = `${environment.apiUrl}/audit`;

  constructor(http: HttpClient) {
    super(http);
  }

  public listAudits(params: IAuditParams): Observable<IAuditResponse> {
    return this.get<IAuditResponse>(this.baseUrl, params);
  }
}