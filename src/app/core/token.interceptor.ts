import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { catchError, throwError } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  const token = auth.getToken();
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        snackBar.open('Session expired. Please log in again.', 'Close', { duration: 4000 });
        auth.logout();
        router.navigate(['/login']);
      } else {
        snackBar.open(error?.error?.message || 'An error occurred', 'Close', { duration: 4000 });
      }
      return throwError(() => error);
    })
  );
};
