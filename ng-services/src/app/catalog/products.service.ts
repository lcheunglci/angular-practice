import { Product } from "@shared/product.model";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({ providedIn: 'root'})
export class ProductService {

  private products: Subject<Product[]> = new Subject();

  getProducts(): Observable<Product[]> {

    // fetch('/api/product')

    return this.products;
  }

}