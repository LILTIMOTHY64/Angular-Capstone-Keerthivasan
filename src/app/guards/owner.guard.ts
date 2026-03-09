import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Require user to have 'owner' role
 * Redirects to /login if not logged in, /products if not owner
 */
export const ownerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // Only owners may proceed. For any other user (buyer or not logged in)
  // show a 404 page instead of redirecting to login/home to avoid exposing
  // owner-only routes.
  if (auth.isOwner()) return true;
  return router.createUrlTree(['/404']);
};
