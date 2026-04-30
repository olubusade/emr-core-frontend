import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, map, shareReplay, startWith, Subscription } from 'rxjs';
import { BtgCountdown } from '../interfaces/btg.interface';

@Injectable({ providedIn: 'root' })
export class BtgCountdownService {

  private countdownSubject = new BehaviorSubject<BtgCountdown | null>(null);
  countdown$ = this.countdownSubject.asObservable();

  private subscription?: Subscription;

  private currentBTG: {
    btgRequestId: string;
    patientId: string;
    expiresAt: Date;
  } | null = null;

  /**
   * Start countdown when BTG is approved
   */
startCountdown(expiresAt: string) {

  return interval(1000).pipe(
    map(() => {

      const diff = new Date(expiresAt).getTime() - Date.now();

      if (diff <= 0) {
        return {
          text: '00:00',
          level: 'critical'
        };
      }

      const totalSeconds = Math.floor(diff / 1000);

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      const text =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      let level = 'safe';
      if (totalSeconds < 60) level = 'critical';
      else if (totalSeconds < 180) level = 'warning';

      return { text, level };
    })
  );
}

  /**
   * Stop countdown (cleanup)
   */
  stopCountdown() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }

    this.currentBTG = null;
    this.countdownSubject.next(null);
  }

  /**
   * Core calculation engine (NOW includes urgency)
   */
  private calculateCountdown(): BtgCountdown | null {
    if (!this.currentBTG) return null;

    const now = Date.now();
    const expiresAt = this.currentBTG.expiresAt.getTime();

    const remainingMs = expiresAt - now;
    const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));

    // 🔥 URGENCY LEVEL
    let level: 'safe' | 'warning' | 'critical' = 'safe';

    if (remainingMs <= 2 * 60 * 1000) level = 'critical';
    else if (remainingMs <= 10 * 60 * 1000) level = 'warning';

    return {
      btgRequestId: this.currentBTG.btgRequestId,
      patientId: this.currentBTG.patientId,
      expiresAt: this.currentBTG.expiresAt,
      remainingMs: Math.max(0, remainingMs),
      remainingSeconds,
      isExpired: remainingMs <= 0,
      level
    };
  }
}