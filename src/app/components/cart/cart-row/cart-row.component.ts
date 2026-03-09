import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from '../../../models/cart.model';

@Component({
  selector: 'app-cart-row',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-row.component.html',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartRowComponent {
  @Input({ required: true }) item!: CartItem;

  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
  @Output() confirmRemove = new EventEmitter<void>();
}
