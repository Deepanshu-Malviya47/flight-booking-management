import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthStateService } from '../services/auth-state-service.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class UserProfileComponent implements OnInit {
  userInfo: any = null;
  deleteForm: FormGroup;
  message: string = '';
  errorMessage: string = '';
  showDeletePrompt: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
     private authState: AuthStateService
  ) {
    this.deleteForm = this.fb.group({
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.isLoggedIn = true;
      const decoded = this.decodeToken(token);
      this.authService.getUserInfo().subscribe({
          next: (info) => {
            this.userInfo = info;
          },
          error: (err) => {
            this.errorMessage = 'Failed to load user info';
          }
        });
    }
  
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authState.updateAuthState(null);
    this.router.navigate(['/']);
  }

  deleteAccount(): void {
    this.message = '';
    this.errorMessage = '';

    if (this.deleteForm.invalid || !this.userInfo?.username || !this.userInfo?.role) {
      this.deleteForm.markAllAsTouched();
      return;
    }

    const password = this.deleteForm.get('password')?.value;
    const username = this.userInfo.username;
    const role = this.userInfo.role;

    this.authService.deleteUser(password, role).subscribe({
      next: (res: string) => {
        this.message = res;
        localStorage.removeItem('token');
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }
  cancelDelete(): void {
    this.showDeletePrompt = false;
    this.deleteForm.reset();
    this.message = '';
    this.errorMessage = '';
  }

  confirmDelete(): void {
    this.message = '';
    this.errorMessage = '';

    if (this.deleteForm.invalid || !this.userInfo?.username || !this.userInfo?.role) {
      this.deleteForm.markAllAsTouched();
      return;
    }

    const password = this.deleteForm.get('password')?.value;
    const role = this.userInfo.role;

    this.authService.deleteUser(password, role).subscribe({
      next: (res: string) => {
        this.message = res;
        localStorage.removeItem('token');
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }
}