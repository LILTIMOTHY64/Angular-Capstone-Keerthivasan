import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../../services/cart.service';
import { ToastService } from '../../../services/toast.service';
import { CartRowComponent } from '../cart-row/cart-row.component';
import { CartAction } from '../../../models/cart.model';

/**
 * Cart items table with quantity controls and remove/clear options
 * Shows confirmation dialogs for destructive actions
 */
@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CurrencyPipe, AsyncPipe, CartRowComponent],
  templateUrl: './cart-view.component.html',
  styleUrl: './cart-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartViewComponent {
  protected readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);

  // Confirmation states for destructive actions
  protected readonly clearConfirm = signal(false);
  protected readonly removeConfirm = signal<number | null>(null);

  // Convert items$ to a signal to avoid async pipe overhead per row
  protected readonly items = toSignal(this.cartService.items$, { initialValue: [] });

  // Cart action dispatcher — single method replaces incrementItem/decrementItem/remove
  protected onCartAction(action: CartAction, productId: number): void {
    if (action === 'increment') {
      this.cartService.incrementItem(productId);
    } else if (action === 'decrement') {
      this.cartService.decrementItem(productId);
    } else if (action === 'remove') {
      this.cartService.removeItem(productId);
      this.toastService.success('Item removed from cart.');
      this.removeConfirm.set(null);
    }
  }

  // Remove single item confirmation
  protected confirmRemove(productId: number): void {
    this.removeConfirm.set(productId);
  }

  // Cancel remove item confirmation
  protected cancelRemove(): void {
    this.removeConfirm.set(null);
  }

  // Remove item from cart
  protected remove(productId: number): void {
    this.onCartAction('remove', productId);
  }

  // Clear entire cart confirmation
  protected confirmClear(): void {
    this.clearConfirm.set(true);
  }

  // Cancel clear cart confirmation
  protected cancelClear(): void {
    this.clearConfirm.set(false);
  }

  // Clear entire cart
  protected clearCart(): void {
    this.cartService.clearCart();
    this.toastService.success('Cart cleared.');
    this.clearConfirm.set(false);
  }
}
