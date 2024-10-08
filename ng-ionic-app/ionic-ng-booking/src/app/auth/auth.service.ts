import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface AuthResponseData {
  idToken: string; //	A Firebase Auth ID token for the authenticated user.
  email: string; // 	The email for the authenticated user.
  refreshToken: string; //	A Firebase Auth refresh token for the authenticated user.
  expiresIn: string; //	The number of seconds in which the ID token expires.
  localId: string; //	The uid of the authenticated user.
  registered?: boolean; //	Whether the email is for an existing account.
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userIsAuthenticated = false;
  private _userId!: string;

  get userIsAuthenticated(): boolean {
    return this._userIsAuthenticated;
  }

  get userId(): string {
    return this._userId;
  }

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        environment.AUTH_SIGN_UP_URL + environment.FB_API_KEY,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        tap((resData) => {
          this._userId = resData.localId;
        })
      );
  }

  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
  }
}
