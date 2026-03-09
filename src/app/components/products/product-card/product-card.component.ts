import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Product } from '../../../models/product.model';

/**
 * Reusable product card component
 * Displays product info and cart controls based on user role
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-card.component.html',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  // Parent provides current quantity (computed once at parent level)
  @Input() quantity = 0;

  // Emit events so the parent handles cart mutations (single handlers)
  @Output() add = new EventEmitter<void>();
  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
  @Output() edit = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  // AuthService is still used for role checks in the template
  protected readonly authService = inject(AuthService);
  protected readonly Math = Math;
}
