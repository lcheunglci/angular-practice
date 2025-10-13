import { Injectable } from '@angular/core';
import { Product } from '../shared/services/product.service';

@Injectable({
  providedIn: 'root',
})
export class ProductLoggingService {
  printProduct(product: Product): void {
    console.log(
      `Product => Name: ${product.name}\nId: ${product.id}\n Price: ${product.price}`
    );
  }
}
