import { effect, inject, Injectable, signal } from '@angular/core';
import { ProductService } from '../products/product.service';
import { HttpClient, httpResource } from '@angular/common/http';
import { Review } from './review';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewsUrl = 'api/reviews';
  private productService = inject(ProductService);
  private http = inject(HttpClient);

  reviewsResource = rxResource({
    params: this.productService.selectedProduct,
    stream: (p) =>
      this.http.get<Review[]>(`${this.reviewsUrl}?productId=^${p.params?.id}$`),
    defaultValue: [],
  });

  // reviewsResource = httpResource<Review[]>(() =>
  //   this.productService.selectedProduct() ?
  //     `${this.reviewsUrl}?productId=^${this.productService.selectedProduct()?.id}$` : undefined,
  //   { defaultValue: [] }
  // );

  // *** To support search ***

  enteredSearch = signal('');
  searchText$ = toObservable(this.enteredSearch).pipe(
    debounceTime(400),
    distinctUntilChanged(),
    map((text) => text.toLocaleLowerCase())
  );
  searchText = toSignal(this.searchText$, { initialValue: '' });

  // reviewSearchResource = httpResource<Review[]>(
  //   () => `${this.reviewsUrl}?text=${this.searchText()}`,
  //   { defaultValue: [] }
  // );

  reviewSearchResource = rxResource({
    params: this.searchText,
    stream: (p) =>
      this.http
        .get<Review[]>(`${this.reviewsUrl}?text=${p.params}`)
        .pipe(
          map((items) => items.sort((a, b) => (a.title < b.title ? -1 : 0)))
        ),
    defaultValue: [],
  });

  effSearch = effect(() => console.log('Entered search:', this.searchText()));

  effLoading = effect(() =>
    console.log('HTTP request loading:', this.reviewSearchResource.isLoading())
  );
}
