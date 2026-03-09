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
    const m = new Map<number, number>();
    this.cartItems().forEach((i) => m.set(i.productId, i.quantity));
    return m;
  });

  // Computed: filter by selected category
  protected readonly products = computed(() => {
    const cat = this.selectedCategory();
    return cat ? this.allProducts().filter((p) => p.category === cat) : this.allProducts();
  });

  // Computed: total pages available
  protected readonly totalPages = computed(() => {
    return Math.ceil(this.products().length / this.itemsPerPage());
  });

  // Transient toast message (used when guard redirects an already-signed-in user)
  protected readonly toastMessage = signal<string | null>(null);

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
      this.toastMessage.set('You are already signed in.');
      setTimeout(() => this.toastMessage.set(null), 3000);
    }
    // Fetch all products
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.allProducts.set(data);
        const cats = [...new Set(data.map((p) => p.category))];
        this.categories.set(cats);
        this.loadingService.hide();
      },
      error: () => {
        this.errorService.setError('Failed to load products. Please try again.');
        this.loadingService.hide();
      },
    });
  }

  // Select category filter
  protected selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
    this.currentPage.set(1);
  }

  // Go to next page
  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Go to previous page
  protected previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
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

  // Success indicator for recent delete (product id)
  protected readonly deletedSuccess = signal<number | null>(null);

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
    const id = this.deleteConfirm();
    if (id === null) return;
    this.deleteConfirm.set(null);
    this.loadingService.show();
    this.apiService.deleteProduct(id).subscribe({
      next: () => {
        this.loadingService.hide();
        // Do not remove the item from the list per spec — just show success
        this.deletedSuccess.set(id);
        // Clear success after 2s
        setTimeout(() => this.deletedSuccess.set(null), 2000);
      },
      error: () => {
        this.errorService.setError('Failed to delete product.');
        this.loadingService.hide();
      },
    });
  }

  // Owner actions
  protected editProduct(productId: number): void {
    this.router.navigate(['/manage-product', productId]);
  }
}
