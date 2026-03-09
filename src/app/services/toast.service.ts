import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/**
 * Lightweight toast notification service.
 * Components call success/error/info/warning and the ToastComponent renders the queue.
 * Each toast auto-dismisses after the given duration (default 3 s).
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;

  // Reactive list of active toasts — read by ToastComponent
  readonly toasts = signal<Toast[]>([]);

  // --- Public API ---

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 4000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 3500): void {
    this.show(message, 'warning', duration);
  }

  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }

  // --- Private helpers ---

  private show(message: string, type: ToastType, duration: number): void {
    const id = ++this.nextId;
    this.toasts.update((current) => [...current, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }
}
