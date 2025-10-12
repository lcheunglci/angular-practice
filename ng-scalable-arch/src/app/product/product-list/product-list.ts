import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ProductDetailComponent } from "../product-detail/product-detail";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
  standalone: false
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(p => this.products = p);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

}
