import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../product.service';
import { ReviewList } from '../../reviews/review-list/review-list';
import { filter, fromEvent, map, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SupplierService } from '../../suppliers/supplier.service';

@Component({
  selector: 'app-product-selection',
  imports: [FormsModule, CurrencyPipe, ReviewList],
  templateUrl: './product-selection.html',
  styleUrl: './product-selection.css',
})
export class ProductSelection {
  pageTitle = 'Product Selection';
  private productService = inject(ProductService);
  private supplierService = inject(SupplierService);

  showHelp = signal(false);
  questionMark$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    map((event) => event.key),
    // tap((key) => console.log(key)),
    filter((key) => key === '?' || key === 'Escape'),
    tap((key) => this.showHelp.set(key === '?')),
    takeUntilDestroyed()
  );
  sub = this.questionMark$.subscribe();

  // Signals used by the template
  selectedProduct = this.productService.selectedProduct;

  // Reference the resource properties
  products = this.productService.productsResource.value;
  isLoading = this.productService.productsResource.isLoading;
  error = this.productService.productsResource.error;
  errorMessage = computed(() => (this.error() ? this.error()?.message : ''));

  selectedProductSuppliers = this.supplierService.suppliersResource.value;
  suppliers = computed(() =>
    this.selectedProductSuppliers()
      .map((s) => s.name)
      .join(', ')
  );
}
