import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, AsyncPipe } from '@angular/common';
import { CartViewComponent } from '../../components/cart/cart-view/cart-view.component';
import { CartService } from '../../services/cart.service';

/**
 * Shopping cart page
 * Shows cart items and checkout button (placeholder)
 */
@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, AsyncPipe, CartViewComponent],
  templateUrl: './cart-page.component.html',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPageComponent {
  protected readonly cartService = inject(CartService);

  // Toggle checkout modal visibility
  protected readonly showConstructionModal = signal(false);

  // Open construction modal
  protected openConstructionModal(): void {
    this.showConstructionModal.set(true);
  }

  // Close construction modal
  protected closeConstructionModal(): void {
    this.showConstructionModal.set(false);
  }
}
