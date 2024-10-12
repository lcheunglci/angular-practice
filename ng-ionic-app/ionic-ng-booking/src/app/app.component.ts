import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  authSub: Subscription = new Subscription();
  private previousAuthState = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  ngOnInit(): void {
    this.authSub.add(
      this.authService.userIsAuthenticated.subscribe((isAuth) => {
        if (!isAuth && this.previousAuthState !== isAuth) {
          this.router.navigateByUrl('/auth');
        }
        this.previousAuthState = isAuth;
      })
    );
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
