import { Injectable, signal } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  Auth,
  authState,
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

  initAuthListener() {
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.authenticated.set(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((results) => {
        console.log(results);
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

  login(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString(),
    // };
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((results) => {
        console.log(results);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logout() {
    signOut(this.auth);
  }

  getUser() {
    return { ...this.authUser };
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
