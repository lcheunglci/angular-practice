import { Component, input } from '@angular/core';
import { IProduct } from '../product.model';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'bot-cart-item',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent {
  product = input.required<IProduct>();

  constructor(private cartService: CartService) {

  }

  getImageUrl(product: IProduct) {
    return '/images/robot-parts/' + product.imageName;
  }

  removeFromCart() {
    this.cartService.removeFromCart(this.product());
  }

  getPriceClasses() {
    return { strikethrough: this.product().discount > 0 }
  }
}
