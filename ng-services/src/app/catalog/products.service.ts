import { Product } from "@shared/product.model";
import { productsArray } from "./products-data";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({ providedIn: 'root'})
export class ProductService {

  private products: Subject<Product[]> = new Subject();

  getProducts(): Observable<Product[]> {
    return this.products;
  }

  refreshProducts() {
    this.products.next(productsArray);
  }
}