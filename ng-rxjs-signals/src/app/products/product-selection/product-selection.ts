import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../product.service';
import { ReviewList } from '../../reviews/review-list/review-list';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-product-selection',
  imports: [FormsModule, CurrencyPipe, ReviewList],
  templateUrl: './product-selection.html',
  styleUrl: './product-selection.css',
})
export class ProductSelection {
  pageTitle = 'Product Selection';
  private productService = inject(ProductService);

  showHelp = signal(false);
  questionMark$ = fromEvent<KeyboardEvent>(document, 'keydown');
  sub = this.questionMark$.subscribe((e) => this.showHelp.set(true));

  // Signals used by the template
  selectedProduct = this.productService.selectedProduct;

  // Reference the resource properties
  products = this.productService.productsResource.value;
  isLoading = this.productService.productsResource.isLoading;
  error = this.productService.productsResource.error;
  errorMessage = computed(() => (this.error() ? this.error()?.message : ''));
}
