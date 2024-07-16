import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IUserCredentials } from '../user.model';

@Component({
  selector: 'bot-sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [FormsModule]
})

export class SignInComponent {

  credentials: IUserCredentials = {email: '', password: ''}
  constructor() { }

}
