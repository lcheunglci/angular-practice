import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from './product.model';

@Pipe({
  name: 'filterByCategory',
})
export class FilterByCategoryPipe implements PipeTransform {
  transform(products: IProduct[], category: string | null[]): IProduct[] {
    if (!category) {
      return products;
    }
    return products.filter((p) => p.category === category);
  }
}
