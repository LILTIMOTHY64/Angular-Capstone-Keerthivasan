// Cart item with quantity tracking
export interface CartItem {
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export type CartAction = 'add' | 'increment' | 'decrement' | 'remove';
