import { Component, signal, input } from '@angular/core';
import { IProduct } from '../product.model';
import { CommonModule } from '@angular/common';
import { CategoryToPartTypePipe } from '../category-to-part-type-pipe';

@Component({
  selector: 'bot-product-details',
  imports: [CommonModule, CategoryToPartTypePipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product = input.required<IProduct>();
  availableInventory = signal(5);

  inventoryMap = {
    '=0': 'Out of Stock',
    '=1': 'Only one left!',
    '=2': 'Few left!',
    '=3': 'Few left!',
    '=4': 'Few left!',
    other: 'Get yours today!',
  };

  getImageUrl(product: IProduct) {
    return '/images/robot-parts/' + product.imageName;
  }

  getPriceClasses() {
    return { strikethrough: this.product().discount > 0 };
  }
}
