import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorService } from '../../services/error.service';

/**
 * Global error alert component
 * Displays error message from ErrorService with dismiss button
 */
@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    @if (errorService.error()) {
      <div
        role="alert"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      >
        <span class="block sm:inline">{{ errorService.error() }}</span>
        <button
          type="button"
          class="absolute top-0 right-0 px-4 py-3"
          aria-label="Dismiss error"
          (click)="errorService.clearError()"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    }
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// Error message component
export class ErrorMessageComponent {
  protected readonly errorService = inject(ErrorService);
}
