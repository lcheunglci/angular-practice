import { Component } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { IProduct } from '../product.model';
import allProducts from '../products.json';
import { CartService } from '../cart.service';
import { FilterByCategoryPipe } from '../filter-by-category-pipe';

@Component({
  selector: 'bot-catalog',
  imports: [ProductDetailsComponent, FilterByCategoryPipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent {
  products: IProduct[] = allProducts;
  categoryFilter: string | null = null;

  constructor(private cartService: CartService) {}

  addProduct() {
    this.products = [
      ...this.products,
      {
        id: 6,
        description: 'Something new.',
        name: 'New arm',
        imageName: 'arm-propeller.png',
        category: 'arms',
        price: 100,
        discount: 0,
      },
    ];
  }

  addToCart(product: IProduct) {
    // this.availableInventory.update((p) => p - 1);
    this.cartService.addToCart(product);
  }
}
