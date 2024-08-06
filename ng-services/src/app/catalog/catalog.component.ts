import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './products.service';
import { CartService } from '@core/cart.service';

@Component({
  selector: 'bot-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productsService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe(
      (products) => this.products = products
    );
  }

  addToCart(product: Product) {
    this.cartService.add(product);
  }
}
