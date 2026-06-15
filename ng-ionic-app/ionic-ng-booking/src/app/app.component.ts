import { Component, OnDestroy, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ThemeService } from './shared/services/theme.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Capacitor, Plugins } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  authSub: Subscription = new Subscription();
  themeSub: Subscription = new Subscription();
  private previousAuthState = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
    private platform: Platform,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.themeSub.unsubscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        SplashScreen.hide();
      }
    })
  }

  ngOnInit(): void {
    this.loadTheme();
    this.authSub.add(
      this.authService.userIsAuthenticated.subscribe((isAuth) => {
        if (!isAuth && this.previousAuthState !== isAuth) {
          this.router.navigateByUrl('/auth');
        }
        this.previousAuthState = isAuth;
      })
    );
  }

  private loadTheme(): void {
    this.themeService.loadSavedTheme().then(() => {
      this.applyTheme(this.themeService.currentThemeValue);
      this.themeSub = this.themeService.currentTheme.subscribe((theme) => {
        this.applyTheme(theme);
      });
    });
  }

  private applyTheme(theme: string): void {
    const ionApp = this.elementRef.nativeElement.querySelector('ion-app');
    if (ionApp) {
      this.renderer.removeClass(ionApp, 'theme-dark');
      this.renderer.removeClass(ionApp, 'theme-blue');
      this.renderer.removeClass(ionApp, 'theme-green');
      this.renderer.addClass(ionApp, `theme-${theme}`);
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
