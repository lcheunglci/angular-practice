import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Product } from './product.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = new BehaviorSubject<Product[]>([]);

  addToCart(product: Product) {
    const current = this.items.value;
    this.items.next([...current, product]);
  }

  removeFromCart(id: number) {
    const current = this.items.value.filter(p => p.id !== id);
    this.items.next(current);
  }

  getItems(): Observable<Product[]> {
    return this.items.asObservable();
  }

  getTotal(): Observable<number> {
    return this.items.pipe(map(items => items.reduce((sum, p) => sum + p.price, 0)));
  }
}
