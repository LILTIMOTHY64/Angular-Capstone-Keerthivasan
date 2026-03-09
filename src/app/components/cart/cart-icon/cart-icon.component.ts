import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../../services/cart.service';

/**
 * Cart badge icon in header
 * Shows total item count, converts Observable to Signal for template performance
 */
@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a
      routerLink="/cart"
      class="relative inline-flex items-center hover:opacity-70 transition-opacity p-2"
      aria-label="View cart"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        style="color: var(--color-text)"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13h10M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
        />
      </svg>
      @if (totalCount() > 0) {
        <span
          class="absolute top-0 right-0 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          style="background-color: var(--flopkart-blue)"
          [attr.aria-label]="totalCount() + ' items in cart'"
          >{{ totalCount() }}</span
        >
      }
    </a>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartIconComponent {
  private readonly cartService = inject(CartService);

  // Convert RxJS Observable to Signal for efficient template binding
  // initialValue: 0 shows 0 until observable first emits
  protected readonly totalCount = toSignal(this.cartService.totalCount$, { initialValue: 0 });
}
