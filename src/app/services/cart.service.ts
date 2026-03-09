import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, CartAction } from '../models/cart.model';

// Storage key private to CartService

/**
 * Manages shopping cart state using RxJS BehaviorSubject
 * Persists cart to browser localStorage for session recovery
 * Provides observables for items, totalCount, and totalPrice
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private static readonly STORAGE_KEY = 'flopkart_cart';
  // Private state: array of cart items (restored from localStorage if available)
  private readonly cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage());

  // Public observables
  readonly items$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  // Computed: sum of all item quantities
  readonly totalCount$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((sum, item) => sum + item.quantity, 0)),
  );

  // Computed: sum of (price × quantity) for all items
  readonly totalPrice$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0)),
  );

  // Load cart from localStorage on initialization
  private loadCartFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(CartService.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      console.warn('Failed to load cart from storage');
      return [];
    }
  }

  // Save cart to localStorage after any change
  private saveCartToStorage(): void {
    try {
      localStorage.setItem(CartService.STORAGE_KEY, JSON.stringify(this.cartItemsSubject.value));
    } catch {
      console.warn('Failed to save cart to storage');
    }
  }

  // Get quantity for specific product (sync method for computed signals)
  getQuantity(productId: number): number {
    return this.cartItemsSubject.value.find((cartItem) => cartItem.productId === productId)?.quantity ?? 0;
  }

  // Get all cart items synchronously
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Add new item or increment quantity if already in cart
  addItem(item: Omit<CartItem, 'quantity'>): void {
    const items = this.cartItemsSubject.value;
    const existing = items.find((cartItem) => cartItem.productId === item.productId);

    if (existing) {
      const updated = items.map((cartItem) =>
        cartItem.productId === item.productId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
      );
      this.cartItemsSubject.next(updated);
    } else {
      this.cartItemsSubject.next([...items, { ...item, quantity: 1 }]);
    }
    this.saveCartToStorage();
  }

  // Increase quantity by 1
  incrementItem(productId: number): void {
    this.updateItem('increment', productId);
  }

  // Decrease quantity by 1, remove if quantity reaches 0
  decrementItem(productId: number): void {
    this.updateItem('decrement', productId);
  }

  // Remove item from cart completely
  removeItem(productId: number): void {
    this.updateItem('remove', productId);
  }

  // Parametrized dispatcher for increment, decrement and remove
  updateItem(action: Exclude<CartAction, 'add'>, productId: number): void {
    const items = this.cartItemsSubject.value;

    if (action === 'remove') {
      this.cartItemsSubject.next(items.filter((cartItem) => cartItem.productId !== productId));
    } else {
      const existing = items.find((cartItem) => cartItem.productId === productId);
      if (action === 'decrement' && (!existing || existing.quantity <= 1)) {
        this.cartItemsSubject.next(items.filter((cartItem) => cartItem.productId !== productId));
      } else {
        const quantityDelta = action === 'increment' ? 1 : -1;
        this.cartItemsSubject.next(
          items.map((cartItem) =>
            cartItem.productId === productId
              ? { ...cartItem, quantity: cartItem.quantity + quantityDelta }
              : cartItem,
          ),
        );
      }
    }
    this.saveCartToStorage();
  }

  // Clear entire cart
  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage();
  }
}
