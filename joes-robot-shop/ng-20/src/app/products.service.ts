import { Injectable } from '@angular/core';
import allProducts from './products.json';
import { IProduct } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  getProducts(): IProduct[] {
    return allProducts;
  }
}
