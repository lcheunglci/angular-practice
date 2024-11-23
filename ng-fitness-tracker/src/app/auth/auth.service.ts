import { Injectable, signal } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: User | null = null;
  authChange = new Subject<boolean>();
  authenticated = signal(false);

  constructor(private router: Router, private fireAuth: AngularFireAuth) {}

  registerUser(authData: AuthData) {
    this.fireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((results) => {
        console.log(results);
        this.authSuccessfully();
      })
      .catch((error) => {
        console.log(error);
      });

    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString(),
    // };
    // this.authSuccessfully();
  }

  private authSuccessfully() {
    this.authChange.next(true);
    this.authenticated.set(true);
  }

  login(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString(),
    // };
    this.fireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((results) => {
        console.log(results);
        this.authSuccessfully();
      })
      .catch((error) => {
        console.log(error);
      });

    this.authSuccessfully();
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
