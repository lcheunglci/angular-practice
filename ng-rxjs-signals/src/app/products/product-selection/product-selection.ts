import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../product.service';
import { ReviewList } from '../../reviews/review-list/review-list';
import { filter, fromEvent, map, tap } from 'rxjs';

@Component({
  selector: 'app-product-selection',
  imports: [FormsModule, CurrencyPipe, ReviewList],
  templateUrl: './product-selection.html',
  styleUrl: './product-selection.css',
})
export class ProductSelection implements OnDestroy {
  pageTitle = 'Product Selection';
  private productService = inject(ProductService);

  showHelp = signal(false);
  questionMark$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    map((event) => event.key),
    tap((key) => console.log(key)),
    filter((key) => key === '?' || key === 'Escape'),
    tap((key) => this.showHelp.set(key === '?'))
  );
  sub = this.questionMark$.subscribe();

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // Signals used by the template
  selectedProduct = this.productService.selectedProduct;

  // Reference the resource properties
  products = this.productService.productsResource.value;
  isLoading = this.productService.productsResource.isLoading;
  error = this.productService.productsResource.error;
  errorMessage = computed(() => (this.error() ? this.error()?.message : ''));
}
