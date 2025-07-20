import { httpResource } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  // Signals to support the template
  selectedProduct = signal<Product | undefined>(undefined);

  // Retrieve data into a signal
  productsResource = httpResource<Product[]>(() => this.productsUrl, { defaultValue: [] });

}
