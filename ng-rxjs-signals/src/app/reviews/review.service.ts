import { inject, Injectable, signal } from '@angular/core';
import { ProductService } from '../products/product.service';
import { httpResource } from '@angular/common/http';
import { Review } from './review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviewsUrl = 'api/reviews';
  private productService = inject(ProductService);

  reviewsResource = httpResource<Review[]>(() =>
    this.productService.selectedProduct() ?
      `${this.reviewsUrl}?productId=^${this.productService.selectedProduct()?.id}$` : undefined,
    { defaultValue: [] }
  );

  // *** To support search ***

  enteredSearch = signal('');

  reviewSearchResource = httpResource<Review[]>(() =>
    `${this.reviewsUrl}?text=${this.enteredSearch()}`,
    { defaultValue: [] }
  );
}
