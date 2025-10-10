import { Component, signal, input, output } from '@angular/core';
import { IProduct } from '../product.model';
import { CommonModule } from '@angular/common';
import { CategoryToPartTypePipe } from '../category-to-part-type-pipe';
import { SliderComponent } from '../slider/slider.component';

@Component({
  selector: 'bot-product-details',
  imports: [CommonModule, CategoryToPartTypePipe, SliderComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product = input.required<IProduct, IProduct>({
    transform: this.normalizeDiscount,
  });
  // width = input<string, number>('5px', { transform: (w: number) => w + 'px' });
  mode = input<'shop' | 'cart'>('shop');
  addToCart = output<IProduct>();
  removeFromCart = output<IProduct>();

  favorite = signal(3);
  availableInventory = signal(5);

  inventoryMap = {
    '=0': 'Out of Stock',
    '=1': 'Only one left!',
    '=2': 'Few left!',
    '=3': 'Few left!',
    '=4': 'Few left!',
    other: 'Get yours today!',
  };

  normalizeDiscount(product: IProduct): IProduct {
    if (product.discount < 1) {
      return product;
    }
    return { ...product, discount: product.discount / 100 };
  }

  add() {
    this.addToCart.emit(this.product());
  }

  remove() {
    this.removeFromCart.emit(this.product());
  }

  handleSliderChange(newValue: number) {
    console.log('New slider value:', newValue);
  }

  getImageUrl(product: IProduct) {
    return '/images/robot-parts/' + product.imageName;
  }

  getPriceClasses() {
    return { strikethrough: this.product().discount > 0 };
  }
}
