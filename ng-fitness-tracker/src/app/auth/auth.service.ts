import { Injectable, signal } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  user,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { TrainingService } from '../training/training.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSub!: Subscription;
  authUser!: User | null;
  isAuthenticated = false;
  authChange = new Subject<boolean>();
  authenticated = signal(false);

  constructor(
    private router: Router,
    private auth: Auth,
    private trainingService: TrainingService
  ) {
    const user$ = user(this.auth);

    this.userSub = user$.subscribe((aUser: User | null) => {
      // handle user state changes here.
      console.log(aUser);
      this.authUser = aUser;
    });
  }

  registerUser(authData: AuthData) {
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
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
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.authenticated.set(true);
    this.router.navigate(['/training']);
  }

  login(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString(),
    // };
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
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
    this.trainingService.cancelSubscriptions();
    this.isAuthenticated = false;
    this.authChange.next(false);
    this.authenticated.set(false);
    signOut(this.auth);
    this.router.navigate(['/login']);
  }

  getUser() {
    return { ...this.authUser };
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
