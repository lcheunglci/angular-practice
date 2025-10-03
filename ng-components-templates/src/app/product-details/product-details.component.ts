import { Component, signal, input } from '@angular/core';
import { IProduct } from '../product.model';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'bot-product-details',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  product = input<any>();
  availableInventory = signal(5);

  constructor(private cartService: CartService) { }

  getImageUrl(product: IProduct) {
    return '/images/robot-parts/' + product.imageName;
  }

  addToCart() {
    this.availableInventory.update((p) => p - 1);
    this.cartService.addToCart(this.product());
  }

  getPriceClasses() {
    return { strikethrough: this.product().discount > 0 }
  }
}
