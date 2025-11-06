import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getIdToken();

  if (req.url.includes('/login')) {
    console.log('⏭️ Skipping auth header for login request');
    return next(req);
  }

  if (accessToken) {
    console.log('🔐 Adding AccessToken to request');
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
