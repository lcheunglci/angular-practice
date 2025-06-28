import { Injectable, signal } from '@angular/core';
import { IProduct } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = signal<IProduct[]>([]);

  constructor() {}

  addToCart(product: IProduct) {
    this.cart.update((cart) => [...cart, product]);
  }

  removeFromCart(product: IProduct) {
    this.cart.update((cart) => cart.filter((p) => p.id != product.id));
  }
}
