import { Injectable, signal } from '@angular/core';

/**
 * Global loading state for showing/hiding spinner across the app
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  // Loading state: true when operation in progress
  private readonly isLoading = signal(false);

  // Read-only signal for components to subscribe to
  readonly loading = this.isLoading.asReadonly();

  // Show loading spinner
  show(): void {
    this.isLoading.set(true);
  }

  // Hide loading spinner
  hide(): void {
    this.isLoading.set(false);
  }
}
