import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../users.service';

@Component({
  selector: 'app-inactive-users',
  templateUrl: './inactive-users.component.html',
  styleUrls: ['./inactive-users.component.css']
})
export class InactiveUsersComponent implements OnInit {


  constructor(private userService: UserService) { }



  ngOnInit(): void {
    this.users = this.userService.activeUsers;
  }

  onSetToInActive(id: number) {
    this.userService.setToInactive(id)
  }
}
