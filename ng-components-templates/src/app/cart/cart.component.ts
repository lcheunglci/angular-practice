import { Component, Signal } from '@angular/core';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { IProduct } from '../product.model';
import { CartService } from '../cart.service';
import { ProductDetailsComponent } from '../product-details/product-details.component';

@Component({
  selector: 'bot-cart',
  imports: [CartItemComponent, ProductDetailsComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartItems: Signal<IProduct[]>;

  constructor(private cartService: CartService) {
    this.cartItems = this.cartService.cart;
  }

  removeFromCart(product: IProduct) {
    this.cartService.removeFromCart(product);
  }
}
