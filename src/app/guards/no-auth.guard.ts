import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Prevent access to routes when the user is already authenticated.
 * If the user is logged in, redirect to /products (or homepage).
 */
export const noAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return true;
  // Redirect to products with a flag so the destination page can show a
  // friendly toast explaining why we redirected.
  return router.createUrlTree(['/products'], { queryParams: { alreadySignedIn: '1' } });
};
