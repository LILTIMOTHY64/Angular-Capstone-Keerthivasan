import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ErrorService } from '../../services/error.service';
import { LoadingService } from '../../services/loading.service';
import { ProductFormComponent } from '../../components/products/product-form/product-form.component';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { Product, ProductPayload } from '../../models/product.model';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

/**
 * Create new product (/add) or edit existing (/manageProduct/:id)
 * Admin only (owner role required by route guard)
 */
@Component({
  selector: 'app-product-manage-page',
  standalone: true,
  imports: [ProductFormComponent, ErrorMessageComponent, LoadingSpinnerComponent],
  templateUrl: './product-manage-page.component.html',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManagePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly errorService = inject(ErrorService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);

  // State
  protected readonly editingProduct = signal<Product | null>(null);
  protected readonly categories = signal<string[]>([]);

  // Computed: true if editing (id in URL), false if creating
  protected readonly isEditMode = computed(() => this.editingProduct() !== null);

  ngOnInit(): void {
    // Load categories for the category select on both Add and Edit pages
    this.apiService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => {
        // if categories fail to load, the form will fall back to a text input
      },
    });
    const rawIdParam = this.route.snapshot.paramMap.get('id');
    if (!rawIdParam) return;
    const productId = Number(rawIdParam);
    if (Number.isNaN(productId)) return;

    // Load product data for edit mode
    this.loadingService.show();
    this.apiService.getProductById(productId).subscribe({
      next: (data) => {
        this.editingProduct.set(data);
        this.loadingService.hide();
      },
      error: () => {
        this.errorService.setError('Failed to load product.');
        this.loadingService.hide();
      },
    });
  }

  // Handle form submission (create or update)
  protected onFormSubmit(payload: ProductPayload): void {
    if (!this.authService.isOwner()) {
      this.toastService.error('You are not authorized to edit this product.');
      return;
    }

    const editing = this.editingProduct();
    this.loadingService.show();

    if (editing) {
      // Update existing product
      this.apiService.updateProduct(editing.id, payload).subscribe({
        next: (updated) => {
          this.loadingService.hide();
          if (!updated) {
            this.toastService.error('Failed to update product.');
            return;
          }
          this.toastService.success('Product updated successfully!');
          // Merge the updated response with the original editing product so
          // any missing fields (for example rating) are preserved for
          // immediate rendering on the detail page.
          const original = this.editingProduct();
          const merged: Product = {
            ...(original ?? ({} as Product)),
            ...updated,
          } as Product;
          setTimeout(() => {
            this.router.navigate(['/products', merged.id], { state: { product: merged } });
          }, 2000);
        },
        error: (err) => {
          this.toastService.error(err?.message || 'Failed to save.');
          this.loadingService.hide();
        },
      });
    } else {
      // Create new product
      this.apiService.createProduct(payload).subscribe({
        next: (created) => {
          this.loadingService.hide();
          if (!created) {
            this.toastService.error('Failed to create product.');
            return;
          }
          this.toastService.success('Product created successfully!');
          // Redirect to all products page after 2 seconds
          setTimeout(() => {
            this.router.navigateByUrl('/products');
          }, 2000);
        },
        error: (err) => {
          this.toastService.error(err?.message || 'Failed to save.');
          this.loadingService.hide();
        },
      });
    }
  }

  // Navigate to home page
  protected goHome(): void {
    this.router.navigateByUrl('/');
  }
}
