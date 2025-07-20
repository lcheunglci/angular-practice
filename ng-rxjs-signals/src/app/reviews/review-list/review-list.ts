import { Component, inject } from '@angular/core';
import { ReviewService } from '../review.service';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-review-list',
  imports: [],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css'
})
export class ReviewList {
  private reviewService = inject(ReviewService);
  private productService = inject(ProductService);

  reviews = this.reviewService.reviewsResource.value;
  isLoading = this.reviewService.reviewsResource.isLoading;
  selectedProduct = this.productService.selectedProduct;
}
