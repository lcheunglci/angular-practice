import { Component } from '@angular/core';
import { UserService } from '../../../../../../src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  username: string = '';

  constructor(private userService: UserService, private router: Router) {}

  login() {
    if (this.username) {
      this.userService.login(this.username);
      this.router.navigate(['/user/profile']);
    }
  }
}
