// metrics.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// 🔑 Assuming BaseApiService path
import { BaseApiService } from 'src/app/core/service/base-api-service'; 
import { IMetricsDataResponse } from '../interfaces/imetrics-data-response.interface';

@Injectable({
  providedIn: 'root',
})
// 🔑 Extend the BaseApiService
export class MetricsService extends BaseApiService {
  private endpoint = '/metrics';
  private prometheusEndpoint = '/prometheus'; // Hypothetical raw Prometheus endpoint

  constructor(http: HttpClient) {
    // 🔑 Inject HttpClient into the base class
    super(http);
  }

  // -------------------- 1. GET ALL METRICS (GET /api/metrics) --------------------
  /**
   * Retrieves all system and EMR operational metrics in a single payload.
   * Corresponds to: GET /api/metrics
   * * @returns Observable<IMetricsDataResponse> - The unwrapped metrics data.
   */
  public getMetrics(): Observable<IMetricsDataResponse> { 
    // 🔑 Use the base service's generic GET method. 
    // BaseApiService handles adding environment.apiUrl and unwrapping the ApiResponse.
    return this.get<IMetricsDataResponse>(`${environment.apiUrl}${this.endpoint}`); 
  }

  // -------------------- 2. GET RAW PROMETHEUS METRICS (Optional) --------------------
  /**
   * Optional helper to fetch raw Prometheus metrics (plaintext).
   * * NOTE: This assumes the backend has a separate plaintext endpoint.
   * If it does, we MUST use standard HttpClient and skip apiOperators 
   * to prevent errors trying to map plaintext as JSON.
   */
  public getPrometheusMetrics(): Observable<string> {
    // 🔑 MUST use this.http directly and set responseType: 'text' to prevent JSON mapping errors.
    // 🔑 MUST NOT pipe through apiOperators or use this.get/post/etc.
    return this.http.get(`${environment.apiUrl}${this.prometheusEndpoint}`, { responseType: 'text' });
  }
}