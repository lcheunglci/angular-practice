import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../../src/app/shared/services/user.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfileComponent implements OnInit {
  user: { name: string } | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUser().subscribe(u => this.user = u);
  }

  logout() {
    this.userService.logout();
  }
}
