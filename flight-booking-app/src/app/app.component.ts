import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AuthStateService } from './services/auth-state-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, FooterComponent, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  constructor(private authState: AuthStateService) {}

  isAdmin: boolean = false;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.authState.updateAuthState(token);

    this.authState.isAdmin$.subscribe(status => {
      this.isAdmin = status;
    });
  }
}
