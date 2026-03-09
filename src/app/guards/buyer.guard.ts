import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Require user to have 'buyer' role
 * Redirects to /login if not logged in, /products if not buyer
 */
export const buyerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isBuyer()) return true;
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  return router.createUrlTree(['/']);
};
