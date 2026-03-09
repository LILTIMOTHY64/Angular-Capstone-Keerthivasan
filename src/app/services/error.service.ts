import { Injectable, signal } from '@angular/core';

/**
 * Global error state management
 * Components set error messages, shared UI displays them
 */
@Injectable({ providedIn: 'root' })
export class ErrorService {
  // Current error message or null if no error
  private readonly isError = signal<string | null>(null);

  // Read-only signal for components to subscribe to
  readonly error = this.isError.asReadonly();

  // Set error message
  setError(message: string): void {
    this.isError.set(message);
  }

  // Clear error message
  clearError(): void {
    this.isError.set(null);
  }
}
