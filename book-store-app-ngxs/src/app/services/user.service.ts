import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _baseUrl = 'https://fakestoreapi.com'

  constructor(private http: HttpClient) {}

  login(user: any): Observable<any> {
    return this.http.post<any>(`${this._baseUrl}/auth/login`, user);
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

}
