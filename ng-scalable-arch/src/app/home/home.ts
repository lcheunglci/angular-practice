import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../shared/services/product.service';
import { CartService } from '../shared/services/cart.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  standalone: false,
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(p => this.products = p);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
