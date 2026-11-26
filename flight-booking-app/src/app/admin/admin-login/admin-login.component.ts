import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../services/auth-state-service.service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  forgotForm: FormGroup;
  resetForm: FormGroup;
  role: string = 'ADMIN';
  showForgot: boolean = false;
  showReset: boolean = false;
  message: string = '';
  errorMessage: string = '';

  isForgotSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private authState: AuthStateService) {
    this.loginForm = this.fb.group({
       username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]{3,20}$')]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$')
      ]]
    });

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.pattern('^\\d{6}$')]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$')
      ]]
    });
  }

  onLogin(): void {
    this.clearMessages();

    if (this.loginForm.invalid) {
      return;
    }



    this.authService.login(this.loginForm.value, this.role).subscribe({
      next: (res) => {
        this.message = `✅ Successfully logged in. \nWelcome ${res.username}`;
        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 1000);
        localStorage.setItem('token', res.token);
        this.authState.updateAuthState(res.token);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed! Verify your credentials.';
        
      }
    });
  }

  onForgot(): void {
    this.clearMessages();
    if (this.isForgotSubmitting) return;

    if (this.forgotForm.invalid) {
    this.forgotForm.markAllAsTouched(); 
    return;
  }



    const email = this.forgotForm.get('email')?.value;
    this.authService.forgotPassword(email, this.role).subscribe({
      next: (res) => {
        this.message = res;
        this.showReset = true;
        this.isForgotSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err;
        this.isForgotSubmitting = false;
      }
    });
  }

  onReset(): void {
    this.clearMessages();

    if (this.resetForm.invalid) {
    this.resetForm.markAllAsTouched(); 
    return;
  }


    this.authService.verifyResetPassword(this.resetForm.value, this.role).subscribe({
      next: (res) => {
        this.message = res;
        this.showReset = false;
        this.loginForm.reset();
        this.forgotForm.reset();
        this.resetForm.reset();

        setTimeout(() => {
          this.toggleLogin()
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }
  private clearMessages(): void {
    this.message = '';
    this.errorMessage = '';
  }

  toggleForgot(): void {
    this.clearMessages();
    this.showForgot = true;
    this.showReset = false;
  }

  toggleLogin(): void {
    this.clearMessages();
    this.showForgot = false;
    this.showReset = false;
  }

}