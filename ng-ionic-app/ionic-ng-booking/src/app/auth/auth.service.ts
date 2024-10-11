import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { Plugins } from '@capacitor/core';

export interface AuthResponseData {
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
  private _user = new BehaviorSubject<User | null>(null);

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        console.log('userIsAuthenticated', user);
        if (user) {
          return !!user.token;
        }
        return false;
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        environment.AUTH_SIGN_UP_URL + environment.FB_API_KEY,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    console.log('login', email, password);
    return this.http
      .post<AuthResponseData>(
        environment.AUTH_SIGN_IN_URL + environment.FB_API_KEY,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this._user.next(null);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );

    this._user.next(user);

    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString());
  }

  storeAuthData(userId: string, token: string, tokenExpirationDate: string) {
    const data = JSON.stringify({userId: userId, token: token, tokenExpirationDate: tokenExpirationDate})
    Plugins.Storage.set({key: 'authData', value: data});
  }
}
