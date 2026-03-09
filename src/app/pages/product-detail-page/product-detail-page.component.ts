import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { ErrorService } from '../../services/error.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';
import { Product } from '../../models/product.model';
import { CartAction } from '../../models/cart.model';
import { Title } from '@angular/platform-browser';
import { ToastService } from '../../services/toast.service';

/**
 * Single product detail page with add-to-cart and delete options
 * Only owners can delete products
 */
@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly cartService = inject(CartService);
  protected readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);
  private readonly errorService = inject(ErrorService);
  private readonly title = inject(Title);
  private readonly toastService = inject(ToastService);
  protected readonly Math = Math;

  // State
  protected readonly product = signal<Product | null>(null);
  protected readonly deleteConfirm = signal(false);

  // Convert cart items observable to signal for reactive updates
  protected readonly cartItems = toSignal(this.cartService.items$, { initialValue: [] });

  // Computed quantity: automatically updates when product or cart items change
  protected readonly quantity = computed(() => {
    const currentProduct = this.product();
    const cartItems = this.cartItems();
    return currentProduct
      ? (cartItems.find((cartItem) => cartItem.productId === currentProduct.id)?.quantity ?? 0)
      : 0;
  });

  // Lifecycle hook: initialize component
  ngOnInit(): void {
    const rawIdParam = this.route.snapshot.paramMap.get('id');
    const productId = rawIdParam ? Number(rawIdParam) : Number.NaN;
    if (Number.isNaN(productId)) return;
    // First: check browser history.state for a product (set when navigating
    // with Router.navigate(..., { state })) and render that immediately to
    // avoid an extra fetch. Avoid calling deprecated Router.getCurrentNavigation().
    const navStateProduct = (history.state && (history.state as any).product) as
      | Product
      | undefined;
    if (navStateProduct && navStateProduct.id === productId) {
      this.product.set(navStateProduct);
      // Set page title immediately when a product is provided via navigation state
      this.title.setTitle(`Flopkart - ${navStateProduct.title}`);
      return;
    }

    this.loadingService.show();
    // Fetch product details by ID
    this.apiService.getProductById(productId).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loadingService.hide();
        // Update page title when product data is loaded
        this.title.setTitle(`Flopkart - ${data.title}`);
      },
      error: () => {
        this.errorService.setError('Failed to load product details.');
        this.loadingService.hide();
      },
    });
  }

  // Cart action dispatcher — single method replaces add/increment/decrement
  protected onCartAction(action: CartAction): void {
    const product = this.product();
    if (!product) return;
    if (action === 'add') {
      this.cartService.addItem({ productId: product.id, title: product.title, price: product.price, image: product.image });
    } else if (action === 'increment') {
      this.cartService.incrementItem(product.id);
    } else if (action === 'decrement') {
      this.cartService.decrementItem(product.id);
    }
  }

  // Confirm product deletion
  protected confirmDelete(): void {
    this.deleteConfirm.set(true);
  }

  // Cancel product deletion
  protected cancelDelete(): void {
    this.deleteConfirm.set(false);
  }

  // Delete product and show success message before redirect
  protected deleteProduct(): void {
    const p = this.product();
    if (!p) return;
    // Close the confirmation modal immediately
    this.deleteConfirm.set(false);
    this.loadingService.show();
    this.apiService.deleteProduct(p.id).subscribe({
      next: () => {
        this.loadingService.hide();
        this.toastService.success('Product deleted successfully.');
        // Redirect to products list after 2 seconds
        setTimeout(() => {
          this.router.navigateByUrl('/products');
        }, 2000);
      },
      error: () => {
        this.toastService.error('Failed to delete product. Please try again.');
        this.loadingService.hide();
      },
    });
  }
}
