import { Component, OnInit, Signal } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';

import { ProductsService } from '../products.service';
import { IProduct } from '../product.model';

@Component({
  selector: 'bot-catalog',
  imports: [ProductDetailsComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent implements OnInit {
  products!: Signal<IProduct[]>;

  constructor(private productsService: ProductsService) {}
  ngOnInit(): void {
    this.products = this.productsService.getProducts();
  }
}
