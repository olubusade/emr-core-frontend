import { catchError, map, OperatorFunction, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http'; // 💡 Import HttpErrorResponse for precise typing

/**
 * ✅ Centralized RxJS operator for API responses.
 * * Responsibilities:
 * - Normalizes API responses ({ data }, { result }, or raw)
 * - Handles network/server errors with meaningful messages
 * - Logs all responses and errors only in development mode
 * * @template T The expected type of the unwrapped data.
 */
// 🔑 FIX: The input stream is now typed as `unknown` to represent the raw HTTP response body.
export function apiOperators<T>(): OperatorFunction<unknown, T> {
  return (source$) =>
    source$.pipe(
      map((response: unknown) => {
        if (!environment.production) {
          console.warn('🌐 [API Response]:', response);
        }

        // ❌ REMOVE automatic unwrapping
        return response as T;
      }),

      catchError((error: unknown) => {
        let status = 0;
        let message = 'An unexpected error occurred.';
        let originalError: unknown = error;

        if (error instanceof HttpErrorResponse) {
          status = error.status;
          originalError = error;

          if (status === 0) {
            message = 'Network error. Please check your internet connection.';
          } else if (status >= 400 && status < 500) {
            message =
              (error.error as { message?: string })?.message ||
              error.message ||
              'Invalid request.';
          } else if (status >= 500) {
            message = 'Server error. Please try again later.';
          }
        } else {
          status = 500;
          message =
            (error as Error)?.message ||
            'A catastrophic error occurred.';
        }

        if (!environment.production) {
          console.error(`❌ [API ERROR ${status}]`, originalError);
        }

        return throwError(() => ({
          status,
          message,
          original: originalError,
        }));
      })
    );
}