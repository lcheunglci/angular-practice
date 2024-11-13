import { Injectable, signal } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: User | null = null;
  authChange = new Subject<boolean>();
  authenticated = signal(false);

  constructor() {}

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
    this.authChange.next(true);
    this.authenticated.set(true);
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
    this.authChange.next(true);
    this.authenticated.set(true);
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this.authenticated.set(false);
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.user != null;
  }
}
