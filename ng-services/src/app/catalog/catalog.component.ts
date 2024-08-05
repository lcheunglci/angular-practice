import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './products.service';

@Component({
  selector: 'bot-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  private cart: Product[] = [];

  constructor(private productsService: ProductService) {}

  ngOnInit(): void {
    this.products = this.productsService.getProducts();
  }

  addToCart(product: Product) {
    this.cart.push(product);
  }
}
