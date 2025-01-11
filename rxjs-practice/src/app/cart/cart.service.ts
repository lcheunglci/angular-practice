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

  subTotal = computed(() =>
    this.cartItems().reduce(
      (accTotal, item) => accTotal + item.quantity * item.product.price,
      0
    )
  );

  // if the subTotal is less than 50, then the delivery fee is 5.99, otherwise it's free
  deliveryFee = computed<number>(() => (this.subTotal() < 50 ? 5.99 : 0));

  tax = computed(() =>
    Math.round(((this.subTotal() + this.deliveryFee()) * 13.0) / 100)
  );

  totalPrice = computed(
    () => this.subTotal() + this.deliveryFee() + this.tax()
  );

  eLength = effect(() => 'Cart array length: ' + this.cartItems().length);

  addToCart(product: Product) {
    // note: this does will not make the notification when the cartItems array is updated, use update or set instead.
    // this.cartItems().push({ product, quantity: 1 });
    this.cartItems.update((items) => [...items, { product, quantity: 1 }]);
  }
}
