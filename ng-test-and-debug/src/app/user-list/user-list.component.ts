import { Component, OnInit } from '@angular/core';
import { User } from '../user/user';
import { UserListService } from './user-list.service';

import { WebStorageService } from '../services/web-storage.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: false,
})
export class UserListComponent implements OnInit {
  //public users: Promise<User[]> | null = null;
  public users: User[] | null = null;

  constructor(
    private userListService: UserListService,
    private webStorageService: WebStorageService
  ) {}

  public async ngOnInit(): Promise<void> {
    const filtered = this.webStorageService.get('USERS');
    this.users = (filtered === null) ? await this.userListService.getAll() : JSON.parse(filtered);
    // this.webStorageService.getRemote().subscribe(
    //   (filtered) => {
    //     this.users =
    //       filtered === null
    //         ? this.userListService.getAll()
    //         : this.userListService.filter(filtered);
    //   },
    //   (error) => {
    //     console.error('ngOnInit Error', error);
    //   }
    // );
  }

  public async update(text: string): Promise<void> {
    this.users = await this.userListService.filter(text);
    this.webStorageService.set('USERS', JSON.stringify(this.users));
    
    // this.webStorageService.setRemote(text).subscribe((filtered) => {
    //   this.users =
    //     filtered === null
    //       ? this.userListService.getAll()
    //       : this.userListService.filter(filtered);
    // });
  }
}
