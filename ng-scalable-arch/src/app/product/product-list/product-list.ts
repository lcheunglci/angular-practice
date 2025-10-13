import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ProductDetailComponent } from '../product-detail/product-detail';
import { MatIconModule } from '@angular/material/icon';
import { ProductLoggingService } from '../../services/product-logging.service';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ProductDetailComponent,
  ],
  templateUrl: './product-list.html',
  providers: [ProductLoggingService],
  styleUrls: ['./product-list.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private loggingService: ProductLoggingService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products) => {
      products.forEach((product) => this.loggingService.printProduct(product));
      this.products = products;
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
