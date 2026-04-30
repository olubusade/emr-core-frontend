import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/** Defines the structure of a single toast notification */
export interface Toast {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration: number; // Duration in milliseconds
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Use a Subject to push new toast data to the component
  private toastSubject = new Subject<Toast | null>();
  
  // Expose the Subject as an Observable for the component to subscribe to
  toast$: Observable<Toast | null> = this.toastSubject.asObservable();

  /**
   * Shows a toast notification.
   * @param type The type (style) of the toast.
   * @param title The toast title.
   * @param message The toast message content.
   * @param duration Time in ms before auto-hiding (default 3000ms).
   */
  private show(type: Toast['type'], title: string, message: string, duration: number = 3000) {
    this.toastSubject.next({ type, title, message, duration });
  }

  // --- Public helper methods for easy use ---

  success(message: string, title: string = 'Success!', duration?: number) {
    this.show('success', title, message, duration);
  }

  error(message: string, title: string = 'Error', duration?: number) {
    this.show('error', title, message, duration);
  }

  warning(message: string, title: string = 'Warning', duration?: number) {
    this.show('warning', title, message, duration);
  }

  info(message: string, title: string = 'Info', duration?: number) {
    this.show('info', title, message, duration);
  }
}