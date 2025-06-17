import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IUserCredentials } from '../user.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bot-sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [FormsModule, CommonModule],
})
export class SignInComponent {

  credentials: IUserCredentials = { email: '', password: '' };
  signInError: boolean = false;

  constructor(private userService: UserService, private router: Router ) {}

  signIn() {
    this.signInError = false;
    this.userService.signIn(this.credentials).subscribe(
      {
        next: ()=> this.router.navigate(['/catalog']),
        error: () => (this.signInError = true)
      }
    );
  }

}
