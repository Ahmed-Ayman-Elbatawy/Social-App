import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.urlWithParams.includes('q=')) {
    return next(req);
  }

  if (req.url.includes('comments') || req.url.includes('notifications')) {
    return next(req);
  }

  const page = Number(new URL(req.urlWithParams, 'http://x').searchParams.get('page'));
  if (page >= 1) {
    return next(req);
  }

  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show('sample');

  return next(req).pipe(
    finalize(() => {
      ngxSpinnerService.hide('sample');
    }),
  );
};
