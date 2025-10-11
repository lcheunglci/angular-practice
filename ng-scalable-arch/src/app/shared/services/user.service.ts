import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private user = new BehaviorSubject<{ name: string } | null>(null);

  login(name: string) {
    this.user.next({ name });
  }

  logout() {
    this.user.next(null);
  }

  getUser(): Observable<{ name: string } | null> {
    return this.user.asObservable();
  }

}
