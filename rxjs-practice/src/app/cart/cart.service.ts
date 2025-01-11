import { computed, effect, Injectable, signal } from '@angular/core';
import { CartItem } from './cart';
import { Product } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() =>
    this.cartItems().reduce((accQty, item) => accQty + item.quantity, 0)
  );

  eLength = effect(() => 'Cart array length: ' + this.cartItems().length);

  addToCart(product: Product) {
    // note: this does will not make the notification when the cartItems array is updated, use update or set instead.
    // this.cartItems().push({ product, quantity: 1 });
    this.cartItems.update((items) => [...items, { product, quantity: 1 }]);
  }
}
