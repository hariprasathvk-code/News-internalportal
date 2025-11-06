import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/role.enum';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🛡️ Auth Guard checking...', state.url);

  if (!authService.isAuthenticated()) {
    console.log('❌ Not authenticated, redirecting to login');
    router.navigate(['/login']);
    return false;
  }

  const userRole = authService.getRole();
  const currentPath = state.url;

  console.log('👤 User role:', userRole);
  console.log('📍 Current path:', currentPath);

  if (currentPath === '/' || currentPath === '') {
    if (userRole === UserRole.JOURNALIST) {
      console.log('➡️ Redirecting to journalist dashboard');
      router.navigate(['/journalist-dashboard']);
      return false;
    } else if (userRole === UserRole.EDITOR) {
      console.log('➡️ Redirecting to editor dashboard');
      router.navigate(['/editor-dashboard']);
      return false;
    }
  }

  if (currentPath.includes('editor-dashboard') && userRole !== UserRole.EDITOR) {
    console.log('⛔ Journalist cannot access Editor dashboard');
    router.navigate(['/journalist-dashboard']);
    return false;
  }

  if (currentPath.includes('journalist-dashboard') && userRole !== UserRole.JOURNALIST) {
    console.log('⛔ Editor cannot access Journalist dashboard');
    router.navigate(['/editor-dashboard']);
    return false;
  }

  console.log('✅ Access granted');
  return true;
};
