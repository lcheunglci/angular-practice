import { Component, Input } from '@angular/core';
import { IProduct } from '../catalog/product.model';

@Component({
  selector: 'bot-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

  @Input() product!: IProduct;

  getImageUrl(product: IProduct) {
    return '/assets/images/robot-parts/' + product.imageName;
  }

  addToCart(product: IProduct) {

  }

  getDiscountedClasses(product: IProduct) {
    if (product.discount > 0) {
      return ['strikethrough'];
    } else {
      return [];
    }
  }
}
