import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _baseUrl = 'https://fakestoreapi.com';
  allProducts = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  getProducts() {
    this.http.get<any>(`${this._baseUrl}/products`).subscribe(
      (response) => {
        this.allProducts.set(response);
      },
      (error) => {
        console.log('getProducts error: ', error);
      }
    );
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this._baseUrl}/products/${id}`);
  }

  getProductsByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this._baseUrl}/products/category/${category}`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this._baseUrl}/products`, product);
  }

  updateProduct(product: any): Observable<any> {
    return this.http.put<any>(
      `${this._baseUrl}/products/${product.id}`,
      product
    );
  }

  removeProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this._baseUrl}/products/${id}`);
  }
}
