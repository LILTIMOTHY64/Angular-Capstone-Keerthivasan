import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

/**
 * Global loading spinner overlay
 * Shows full-screen spinner during API calls
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    @if (loadingService.loading()) {
      <div
        role="status"
        aria-label="Loading"
        class="fixed inset-0 flex items-center justify-center bg-white/60 z-50"
      >
        <div
          class="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
          style="border-color: var(--flopkart-blue); border-top-color: transparent"
        ></div>
        <span class="sr-only" i18n="@@loading">Loading...</span>
      </div>
    }
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// Loading spinner component
export class LoadingSpinnerComponent {
  protected readonly loadingService = inject(LoadingService);
}
