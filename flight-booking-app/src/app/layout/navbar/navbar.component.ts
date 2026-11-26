import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthStateService } from '../../services/auth-state-service.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private router: Router, private authState: AuthStateService) {}

  ngOnInit(): void {
    this.authState.loggedIn$.subscribe(status => this.isLoggedIn = status);
    this.authState.isAdmin$.subscribe(status => this.isAdmin = status);

    // Initial check
    const token = localStorage.getItem('token');
    this.authState.updateAuthState(token);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authState.updateAuthState(null);
    this.router.navigate(['/']);
  }

  goToAdminDashboard(): void {
    const token = localStorage.getItem('token');
    this.authState.updateAuthState(token);

    if (this.isAdmin) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }
}