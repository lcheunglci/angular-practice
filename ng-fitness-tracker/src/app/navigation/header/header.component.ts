import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth$: Observable<boolean> = this.store.select(fromRoot.getIsAuth);

  constructor(
    private store: Store<fromRoot.State>,
    private auth: AuthService
  ) {}
  ngOnInit(): void {}

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.auth.logout();
  }
}
