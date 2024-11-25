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
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private trainingService: TrainingService,
    private snackbar: MatSnackBar
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
        this.authenticated = signal(true);
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
        this.snackbar.open(error.message, '', { duration: 3000 });
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
        this.snackbar.open(error.message, '', { duration: 3000 });
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
