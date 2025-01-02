import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      tap((next) => {
        console.log('In http.get pipeline');
      }),
      catchError(this.handleError)
      // catchError((error) => {
      //   console.error(error);
      //   return of(ProductData.products);
      // })
    );
  }

  getProduct(id: number) {
    const productUrl = this.productsUrl + '/' + id;
    return this.http
      .get<Product>(productUrl)
      .pipe(tap(() => console.log('In http.get by id pipeline')));
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err);
    return throwError(() => formattedMessage);
    // throw formattedMessage;
  }
}
