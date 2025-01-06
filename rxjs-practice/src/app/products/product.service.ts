import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

  // Declarative approach
  readonly products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap((p) => {
      console.log(JSON.stringify(p));
    }),
    catchError(this.handleError)
  );

  // Procedural approach
  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.productsUrl).pipe(
  //     tap(() => {
  //       console.log('In http.get pipeline');
  //     }),
  //     catchError(this.handleError)
  //     // catchError((error) => {
  //     //   console.error(error);
  //     //   return of(ProductData.products);
  //     // })
  //   );
  // }

  getProduct(id: number) {
    const productUrl = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrl).pipe(
      tap(() => console.log('In http.get by id pipeline')),
      switchMap((product) => this.getProductWithReviews(product)),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err);
    return throwError(() => formattedMessage);
    // throw formattedMessage;
  }

  private getProductWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http
        .get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(map((reviews) => ({ ...product, reviews })));
    } else {
      return of(product);
    }
  }
}
