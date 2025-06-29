import { computed, Injectable } from '@angular/core';
import { IProduct } from './product.model';
import { httpResource, HttpResourceRef } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private resource: HttpResourceRef<IProduct[] | undefined> = httpResource(
    () => '/api/products'
  );

  getProducts() {
    // use computed to make it reactive, and it automatically cached
    return computed(() => this.resource.value() ?? []);
  }
}
