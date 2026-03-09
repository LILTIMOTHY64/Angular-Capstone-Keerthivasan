import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';
import { ErrorService } from '../../services/error.service';
import { ProductCardComponent } from '../../components/products/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';
import { Product } from '../../models/product.model';
import { CartAction } from '../../models/cart.model';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

/**
 * Browse and filter products with pagination
 * Features: category filter, 6 items per page
 */
@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [ProductCardComponent, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPageComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly loadingService = inject(LoadingService);
  private readonly errorService = inject(ErrorService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);

  // State signals
  protected readonly allProducts = signal<Product[]>([]);
  protected readonly categories = signal<string[]>([]);
  protected readonly selectedCategory = signal<string>('');
  protected readonly currentPage = signal<number>(1);
  protected readonly itemsPerPage = signal<number>(6);

  // Convert cart items observable to a signal once per page
  private readonly cartItems = toSignal(this.cartService.items$, { initialValue: [] });

  // Map of productId -> quantity, computed once for the page
  protected readonly quantities = computed(() => {
    const quantityMap = new Map<number, number>();
    this.cartItems().forEach((cartItem) => quantityMap.set(cartItem.productId, cartItem.quantity));
    return quantityMap;
  });

  // Computed: filter by selected category
  protected readonly products = computed(() => {
    const selectedCategory = this.selectedCategory();
    return selectedCategory
      ? this.allProducts().filter((product) => product.category === selectedCategory)
      : this.allProducts();
  });

  // Computed: total pages available
  protected readonly totalPages = computed(() => {
    return Math.ceil(this.products().length / this.itemsPerPage());
  });

  // Computed: slice products for current page
  protected readonly paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.products().slice(start, end);
  });

  // Lifecycle hook: initialize component
  ngOnInit(): void {
    this.loadingService.show();
    // If we were redirected here because the user was already signed in,
    // the guard appends ?alreadySignedIn=1 — show a transient info toast.
    const already = this.route.snapshot.queryParamMap.get('alreadySignedIn');
    if (already === '1') {
      this.toastService.info('You are already signed in.');
    }
    // Fetch all products
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.allProducts.set(data);
        const uniqueCategories = [...new Set(data.map((product) => product.category))];
        this.categories.set(uniqueCategories);
        this.loadingService.hide();
      },
      error: () => {
        this.errorService.setError('Failed to load products. Please try again.');
        this.loadingService.hide();
      },
    });
  }

  // Select category filter
  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  // Go to next page
  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Go to previous page
  protected previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Go to specific page
  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Cart action dispatcher — single method replaces add/increment/decrement
  protected onCartAction(action: CartAction, product: Product): void {
    if (action === 'add') {
      this.cartService.addItem({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      });
    } else if (action === 'increment') {
      this.cartService.incrementItem(product.id);
    } else if (action === 'decrement') {
      this.cartService.decrementItem(product.id);
    }
  }

  // Delete confirmation state (product id being confirmed for deletion)
  protected readonly deleteConfirm = signal<number | null>(null);

  // Open confirmation modal for deleting a product
  protected confirmDelete(productId: number): void {
    this.deleteConfirm.set(productId);
  }

  // Cancel delete flow
  protected cancelDelete(): void {
    this.deleteConfirm.set(null);
  }

  // Called when the user confirms deletion in the modal
  protected performDelete(): void {
    const productId = this.deleteConfirm();
    if (productId === null) return;
    this.deleteConfirm.set(null);
    this.loadingService.show();
    this.apiService.deleteProduct(productId).subscribe({
      next: () => {
        this.loadingService.hide();
        this.toastService.success('Product deleted successfully.');
      },
      error: () => {
        this.toastService.error('Failed to delete product. Please try again.');
        this.loadingService.hide();
      },
    });
  }

  // Owner actions
  protected editProduct(productId: number): void {
    this.router.navigate(['/products', productId, 'edit']);
  }
}
