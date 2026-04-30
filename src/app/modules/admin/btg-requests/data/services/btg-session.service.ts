import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, switchMap, startWith, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseApiService } from 'src/app/core/service/base-api-service';
import { BtgSession, BTGViewer } from '../interfaces/btg.interface';

@Injectable({ providedIn: 'root' })
export class BtgSessionService extends BaseApiService {
  private baseUrl = `${environment.apiUrl}/btg-session`;

  constructor(http: HttpClient) {
    super(http);
  }

  
  /**
   * heartbeat → tells backend user is viewing patient under BTG
   */
  registerViewer(btgId: string, patientId: string) {
    
    return this.post(`${this.baseUrl}/register`, {
      btgId,
      patientId
    });
  }

  /**
   * polling fallback (or combine with websocket later)
   */
  getViewers(patientId: string) {
    return this.get<{ data: BTGViewer[] }>(
    `${this.baseUrl}/${patientId}/viewers`
  );
  }

  /**
   * RxJS live stream of viewers
   */
viewersStream(patientId: string) {
  return interval(5000).pipe(
    startWith(0),
    switchMap(() => this.getViewers(patientId)),
    map(res => res?.data ?? []) // ALWAYS array
  );
}
  /**
   * Get active BTG session for patient (if any) - used to trigger countdown timer in UI
   * Note: this endpoint is lightweight and can be polled every 30s or so to keep UI in sync
   * without needing to fetch full BTG request details.
   * @param patientId 
   * @returns 
   */
  getActiveBTGSession(patientId: string) {
    
  return this.get<{ data: BtgSession | null }>(
    `${this.baseUrl}/active/${patientId}`
  );
 }
}