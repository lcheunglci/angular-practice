import { Component, input, signal } from '@angular/core';
import { IProduct } from '../product.model';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'bot-product-details',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product = input.required<IProduct>();
  availableInventory = signal(3);

  getImage(product: IProduct) {
    return '/images/robot-parts/' + product.imageName;
  }

  addToCart(event: MouseEvent) {
    //setTimeout(() => this.availableInventory.set(2), 3000);
    setTimeout(() => this.availableInventory.update((p) => p - 2), 100);
    console.log(event);
  }

  getPriceClasses() {
    return { strikethrough: this.product().discount > 0 };
  }
}
