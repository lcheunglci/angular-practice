import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Coffee } from '../types/coffee';
import { Observable, of, Subject, throwError, TimeoutError, timer } from 'rxjs';
import {
  retry,
  catchError,
  tap,
  map,
  takeUntil,
  timeout,
} from 'rxjs/operators';
import { environment } from '../../environments/environment';

export const COFFEE_API_RETRY_COUNT = new HttpContextToken(
  () => environment.coffeeServiceRetryCount
);

@Injectable({
  providedIn: 'root',
})
export class CoffeeApiService {
  private apiURL = 'https://fake-coffee-api.vercel.app/api';

  constructor(private http: HttpClient) {}

  private cancelCoffeeFetch$ = new Subject<void>();

  /*
    CRUD Methods for consuming RESTful API
  */

  // Note: This particular API does not like the client (us) setting the Content-Type
  // but note that for many JSON endpoints, you will need to use this header.
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // GET
  getCoffees(): Observable<Coffee[]> {
    return (
      this.http
        // Uncomment this to test retry interceptor
        // .get<Coffee[]>(this.apiURL + 'lskdfjalskdf', {
        .get<Coffee[]>(this.apiURL, {
          context: new HttpContext().set(
            COFFEE_API_RETRY_COUNT,
            environment.coffeeServiceRetryCount
          ),
        })
        .pipe(takeUntil(this.cancelCoffeeFetch$), catchError(this.handleError))
    );
  }

  // GET by ID
  getCoffee(id: number): Observable<Coffee> {
    return this.http
      .get<Coffee>(this.apiURL + '/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  // POST
  createCoffee(coffee: Partial<Coffee>): Observable<Coffee> {
    return this.http
      .post<{ success: boolean; added: Coffee }>(
        this.apiURL,
        JSON.stringify(coffee)
      )
      .pipe(
        map((res) => res.added),
        retry(1),
        catchError(this.handleError)
      );
  }

  // PUT
  updateCoffee(coffee: Partial<Coffee>): Observable<Coffee> {
    return this.http
      .put<{ message: string; update: Coffee }>(
        this.apiURL + '/' + coffee.id,
        JSON.stringify(coffee)
      )
      .pipe(
        map((res) => res.update),
        retry(1),
        catchError(this.handleError)
      );
  }

  // DELETE
  deleteCoffee(id: number) {
    return this.http
      .delete<Coffee>(this.apiURL + '/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    //if (error.error instanceof ErrorEvent) {
    if (error.status === 0) {
      // Get client-side error
      errorMessage = error.error.message;
      console.error(
        '[CoffeeApiService] => Client-side HTTP occurred: ',
        errorMessage,
        error
      );
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.error(
        '[CoffeeApiService] => Server-side HTTP error occurred: ',
        errorMessage,
        error
      );
    }
    return throwError(() => {
      return errorMessage;
    });
  }

  private handleErrorWithTimeout(error: HttpErrorResponse | TimeoutError) {
    let errorMessage = '';
    if (error instanceof TimeoutError) {
      console.error('[CoffeeApiService] => Request timed out!', error);
      return throwError(() => {
        return errorMessage;
      });
    } else {
      return this.handleError(error);
    }
  }
}
