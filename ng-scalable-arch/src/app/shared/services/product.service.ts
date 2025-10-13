import { Inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../tokens/config.token';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(@Inject(APP_CONFIG) private config: AppConfig) {
    console.log('CONFIG: ', this.config);
  }

  private products: Product[] = [
    {
      id: 1,
      name: 'Sleek Phone',
      price: 999,
      image:
        'https://plus.unsplash.com/premium_photo-1680985551009-05107cd2752c?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 2,
      name: 'Elegant Laptop',
      price: 1499,
      image:
        'https://images.unsplash.com/photo-1740721455292-e5cd29544381?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products).pipe(delay(this.config.timeout));
  }

  getProduct(id: number): Observable<Product> {
    return of(this.products.find((p) => p.id === id)!);
  }
}
