// core/interceptors/loading.interceptor.ts

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './services/loading.service';


export const LoadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const loading = inject(LoadingService);
  loading.show();

  return next(req).pipe(finalize(() => loading.hide()));
};
