import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.authService.login();
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then((loadingEl) => {
        loadingEl.present();

        if (this.isLogin) {
          // send a request to login servers
          this.authService.login();
        } else {
          //  send a request to signup servers
          this.authService.signup(email, password).subscribe({
            next: (resData) => {
              this.isLoading = false;
              loadingEl.dismiss();
              this.router.navigateByUrl('/places/tabs/discover');
            },
            error: (errRes) => {
              const code = errRes.error.error.message;
              let message = 'Could not sign you up, please try again.';
              if (code === 'EMAIL_EXISTS') {
                message = 'This email address already exists!';
              }
              this.showAlert(message);
            },
          });
        }
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    this.authenticate(email, password);
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication Failed',
        message: message,
        buttons: ['Okay'],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
