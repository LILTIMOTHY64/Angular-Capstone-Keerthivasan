import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { Product, ProductPayload } from '../../../models/product.model';

// URL validation pattern used only by ProductFormComponent

/**
 * Reusable form for creating/editing products
 * Updates form when product input changes (edit mode)
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './product-form.component.html',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnChanges {
  private static readonly URL_PATTERN = /^https?:\/\/.+/i;
  @Input() product: Product | null = null;
  @Input() categories: string[] = [];
  @Output() readonly formSubmit = new EventEmitter<ProductPayload>();

  // Reactive form with validation using FormGroup and FormControl
  protected readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),
    image: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(ProductFormComponent.URL_PATTERN)],
    }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  // Populate form when product input changes
  ngOnChanges(): void {
    if (this.product) {
      this.form.patchValue({
        title: this.product.title,
        description: this.product.description,
        price: this.product.price,
        image: this.product.image,
        category: this.product.category,
      });
    } else {
      this.form.reset({ title: '', description: '', price: 0, image: '', category: '' });
    }
  }

  // Handle form submission
  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.formSubmit.emit(this.form.getRawValue());
  }
}
