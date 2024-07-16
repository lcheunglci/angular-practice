import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IUserCredentials } from '../user.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bot-sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [FormsModule],
})
export class SignInComponent {

  credentials: IUserCredentials = { email: '', password: '' };
  constructor(private userService: UserService, private router: Router ) {}

  signIn() {
    this.userService.signIn(this.credentials).subscribe(
      {
        next: ()=> this.router.navigate(['/catalog']);
      }
    );
  }

}
