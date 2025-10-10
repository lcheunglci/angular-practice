import { Injectable, signal } from '@angular/core';
import allProducts from './products.json';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private inventoryFromProducts = allProducts.reduce((acc, product) => {
    acc[product.id] = 5;
    return acc;
  }, {} as Record<number, number>);

  private allInventory = signal<Record<number, number>>(
    this.inventoryFromProducts
  );

  get(productId: number): number {
    return this.allInventory()[productId];
  }

  decrement(productId: number) {
    this.allInventory.update((i) => ({ ...i, [productId]: i[productId] - 1 }));
  }

  increment(productId: number) {
    this.allInventory.update((i) => ({ ...i, [productId]: i[productId] + 1 }));
  }
}
