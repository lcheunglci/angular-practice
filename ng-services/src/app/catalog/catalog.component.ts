import { Component, Inject } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './products.service';
import { CART_SERVICE_TOKEN, CartService } from '@core/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'bot-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent {
  products: Observable<Product[]> = this.productsService.getProducts();

  constructor(
    private productsService: ProductService,
    @Inject(CART_SERVICE_TOKEN) private cartService: CartService
  ) {}


  addToCart(product: Product) {
    this.cartService.add(product);
  }
}
