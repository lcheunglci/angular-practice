import { Injectable } from '@angular/core';
import { IProduct } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: IProduct[] = [];

  constructor() {}

  addToCart(product: IProduct) {
    this.cart = [...this.cart, product];
  }

  removeFromCart(product: IProduct) {
    this.cart = this.cart.filter((p) => p.id != product.id);
  }
}
