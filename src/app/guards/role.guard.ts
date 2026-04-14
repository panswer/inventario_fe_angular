import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isValidToken()) {
    router.navigate(['/login']);
    return false;
  }

  if (!authService.getUserRole()) {
    await authService.loadProfile();
  }

  const requiredRoles = route.data['roles'] as string[];

  if (!authService.hasRole(requiredRoles)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};