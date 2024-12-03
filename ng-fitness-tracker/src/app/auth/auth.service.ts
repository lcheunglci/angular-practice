import * as fromApp from './../app.reducer';
import * as UI from '../shared/ui.actions';
import * as AUTH from './auth.actions';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subscription } from 'rxjs';
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
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSub!: Subscription;
  authUser!: User | null;

  constructor(
    private router: Router,
    private afAuth: Auth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromApp.State>
  ) {
    const user$ = user(this.afAuth);

    this.userSub = user$.subscribe((aUser: User | null) => {
      // handle user state changes here.
      console.log(aUser);
      this.authUser = aUser;
    });
  }

  initAuthListener() {
    authState(this.afAuth).subscribe((user) => {
      if (user) {
        this.store.dispatch(new AUTH.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(new AUTH.SetUnauthenticated());
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    createUserWithEmailAndPassword(
      this.afAuth,
      authData.email,
      authData.password
    )
      .then((results) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, '', 3000);
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
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    signInWithEmailAndPassword(this.afAuth, authData.email, authData.password)
      .then((results) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, '', 3000);
      });
  }

  logout() {
    signOut(this.afAuth);
  }

  getUser() {
    return { ...this.authUser };
  }
}
