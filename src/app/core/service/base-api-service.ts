import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiOperators } from '../utils/api-operators';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  constructor(protected http: HttpClient) {}

  /**
   * 🔹 GET: Fetches data from the server.
   * Automatically handles object-to-HttpParams conversion.
   */
  get<T>(url: string, params?: Record<string, any>, headers?: HttpHeaders): Observable<T> {
    const httpParams = this.buildHttpParams(params);
    
    // Log the actual URL being requested for easier debugging
    console.log(`📡 [GET] ${url}?${httpParams.toString()}`);

    return this.http.get<T>(url, { params: httpParams, headers }).pipe(
      apiOperators<T>()
    );
  }

  /**
   * 🛡️ The Parameter Architect
   * Handles Angular's immutability and strips out invalid values.
   */
  protected buildHttpParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        // Only append if the value is meaningful (0 is allowed, but not null/undefined/'')
        if (value !== undefined && value !== null && value !== '') {
          // CRITICAL: Reassign because HttpParams is immutable
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return httpParams;
  }

  /* get<T>(url: string, params?: any, headers?: HttpHeaders) {
    return this.http.get<T>(url, { params, headers }).pipe(apiOperators());
  } */
  /**
   * 🔹 POST: Creates a new resource.
   */
  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .post<T>(url, body, { headers })
      .pipe(apiOperators<T>());
  }

  /**
   * 🔹 PUT: Replaces an entire resource.
   */
  put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .put<T>(url, body, { headers })
      .pipe(apiOperators<T>());
  }

  /**
   * 🔹 PATCH: Partially updates a resource.
   */
  patch<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .patch<T>(url, body, { headers })
      .pipe(apiOperators<T>());
  }

  /**
   * 🔹 DELETE: Removes a resource.
   */
  delete<T>(url: string, headers?: HttpHeaders): Observable<T> {
    return this.http
      .delete<T>(url, { headers })
      .pipe(apiOperators<T>());
  }

  /**
   * ✅ CRITICAL FIX: The Immutable Loop
   * Converts a standard JS object into Angular HttpParams.
   */
/*   protected buildHttpParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        // Only append if value is meaningful (0 is allowed, but not null/undefined)
        if (value !== undefined && value !== null && value !== '') {
          // 🛡️ REASSIGNMENT IS KEY: httpParams = httpParams.set(...)
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return httpParams;
  } */
}