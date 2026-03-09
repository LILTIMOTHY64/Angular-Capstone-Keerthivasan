import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartIconComponent } from '../../components/cart/cart-icon/cart-icon.component';
import { AuthService } from '../../services/auth.service';

/**
 * Main navigation header component
 *
 * Provides:
 * - Role-based navigation menu (admin/customer links)
 * - User greeting with current user's name
 * - Shopping cart icon with item count
 * - Mobile-responsive toggle menu
 * - Logout functionality with visual feedback
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CartIconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  /** Authentication service for user state and logout */
  protected readonly authService = inject(AuthService);

  /** Router for programmatic navigation after logout */
  protected readonly router = inject(Router);

  /** Controls mobile menu visibility (collapsed/expanded) */
  protected readonly menuOpen = signal(false);

  /** Tracks logout in-progress state to show feedback message */
  protected readonly loggingOut = signal(false);

  /**
   * Toggles the mobile menu between open and closed states
   */
  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  /**
   * Closes the mobile menu (called after navigation or logout)
   */
  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  /**
   * Logs out the current user and redirects to login page
   *
   * Process:
   * 1. Set loggingOut flag to show feedback message
   * 2. Call authService.logout() to clear user session
   * 3. Close mobile menu if open
   * 4. Wait 1.5s to allow user to see logout message
   * 5. Navigate to login page and reset loggingOut flag
   */
  protected logout(): void {
    this.loggingOut.set(true);
    this.authService.logout();
    this.closeMenu();
    // Show logout message for 1.5 seconds before redirecting
    setTimeout(() => {
      this.router.navigate(['/']);
      this.loggingOut.set(false);
    }, 1500);
  }
}
