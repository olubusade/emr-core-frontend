import { AuthService } from "../service/auth.service";
import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error("API Error::", err);

        // Normalize backend error payload
        const backendError = err.error || {};
        const status = backendError.statusCode || err.status;
        const message = backendError.message || err.statusText || "Unexpected error";
        const details = backendError.details || null;

        // Handle unauthorized (401)
        if (status === 401) {
          console.error("status::", status);
          this.authenticationService.logout();
          // Better than location.reload()
          this.authenticationService.redirectToLogin?.();
        }

        // Bubble up the full object, not just string
        return throwError(() => ({ status, message, details }));
      })
    );
  }
}
