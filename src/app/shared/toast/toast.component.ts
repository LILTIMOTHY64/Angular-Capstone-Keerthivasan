import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toast, ToastService } from '../../services/toast.service';

/**
 * Renders the active toast queue from ToastService.
 * Positioned fixed at the top-right of the viewport.
 * Each toast is colour-coded by type and dismissible on click.
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none',
    'aria-live': 'polite',
    'aria-atomic': 'false',
  },
  template: `
    @for (toast of toastService.toasts(); track toast.id) {
      <div
        role="status"
        class="flex items-start gap-2 pl-3 pr-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm w-full pointer-events-auto cursor-pointer transition-all animate-scale"
        [class]="toastClasses(toast)"
        (click)="toastService.dismiss(toast.id)"
        (keydown.enter)="toastService.dismiss(toast.id)"
        tabindex="0"
        [attr.aria-label]="toast.message + '. Click to dismiss.'"
      >
        <span class="flex-shrink-0 mt-0.5" [innerHTML]="iconFor(toast.type)" aria-hidden="true"></span>
        <span>{{ toast.message }}</span>
      </div>
    }
  `,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);

  protected toastClasses(toast: Toast): string {
    const base = 'text-white';
    const colours: Record<Toast['type'], string> = {
      success: 'bg-green-600',
      error: 'bg-red-600',
      info: 'bg-blue-600',
      warning: 'bg-yellow-500',
    };
    return `${base} ${colours[toast.type]}`;
  }

  protected iconFor(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
      case 'error':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`;
      case 'warning':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>`;
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/></svg>`;
    }
  }
}
