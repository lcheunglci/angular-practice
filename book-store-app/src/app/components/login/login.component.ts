import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user: any = {
    username: 'mor_2314',
    password: '83r5^_'
  };

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    console.log('User to be logged in: ', this.user);
    this.userService.login(this.user).subscribe(data => {
      localStorage.setItem('token', data.token);
      this.router.navigate(['/products']);
    });
  }

}
