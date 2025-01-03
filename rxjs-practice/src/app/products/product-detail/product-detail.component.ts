import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription } from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
})
export class ProductDetailComponent implements OnChanges, OnDestroy {
  @Input() productId: number = 0;
  errorMessage = '';

  private productService = inject(ProductService);
  sub!: Subscription;

  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product
    ? `Product Detail for: ${this.product.productName}`
    : 'Product Detail';

  addToCart(product: Product) {}

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const id = changes['productId'].currentValue;
    if (id) {
      this.sub = this.productService
        .getProduct(id)
        .pipe(
          catchError((error) => {
            this.errorMessage = error;
            return EMPTY;
          })
        )
        .subscribe((product) => {
          this.product = product;
        });
    }
  }
}
