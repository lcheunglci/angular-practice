import { getAuthState, getIsAuth } from './../../app.reducer';
import { getAuth } from '@angular/fire/auth';
import { AuthService } from './../../auth/auth.service';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrl: './sidenav-list.component.css',
})
export class SidenavListComponent implements OnInit {
  @Output() closeSideNav = new EventEmitter<void>();
  isAuth$!: Observable<boolean>;

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onLogout() {
    this.authService.logout();
    this.onClose();
  }

  onClose() {
    this.closeSideNav.emit();
  }
}
