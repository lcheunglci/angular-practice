import { Component, signal } from '@angular/core';
import { IProduct } from '../product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'bot-product-details',
  imports: [CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product: IProduct;
  availableInventory = signal(3);

  constructor() {
    this.product = {
      id: 2,
      description:
        'A friendly robot head with two eyes and a smile -- great for domestic use.',
      name: 'Friendly Bot',
      imageName: 'head-friendly.png',
      category: 'Head',
      price: 945.0,
      discount: 0.2,
    };
  }

  getImage(product: IProduct) {
    return '/images/robot-parts/' + product.imageName;
  }

  addToCart(event: MouseEvent) {
    //setTimeout(() => this.availableInventory.set(2), 3000);
    setTimeout(() => this.availableInventory.update((p) => p - 2), 100);
    console.log(event);
  }
}
