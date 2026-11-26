import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private isAdmin = new BehaviorSubject<boolean>(false);

  loggedIn$ = this.loggedIn.asObservable();
  isAdmin$ = this.isAdmin.asObservable();

  updateAuthState(token: string | null): void {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.loggedIn.next(true);
        this.isAdmin.next(payload?.role === 'ADMIN');
      } catch {
        this.loggedIn.next(false);
        this.isAdmin.next(false);
      }
    } else {
      this.loggedIn.next(false);
      this.isAdmin.next(false);
    }
  }
}