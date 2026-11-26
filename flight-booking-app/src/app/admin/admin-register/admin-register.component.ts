import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-admin-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-register.component.html',
  styleUrl: './admin-register.component.scss'
})
export class AdminRegisterComponent {
  registerForm: FormGroup;
  otpForm: FormGroup;
  submitted: boolean = false;
  otpSent: boolean = false;
  role: string = 'ADMIN';
  message: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]{3,20}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$')
      ]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^\\d{6}$')]]
    });
  }

  onRegister(): void {
    this.submitted = true;
    this.message = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) return;

    this.authService.registerUser(this.registerForm.value, this.role).subscribe({
      next: (res: string) => {
        this.otpSent = true;
        this.message = res;
        this.submitted = false;
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  onVerifyOtp(): void {
    this.message = '';
    this.errorMessage = '';
    if (this.otpForm.invalid) return;

    const payload = { ...this.registerForm.value };
    const otp = this.otpForm.get('otp')?.value;

    this.authService.verifyOtp(payload, otp, this.role).subscribe({
      next: (res:string) => {
        this.message = res;
        this.errorMessage = '';
        this.otpSent = false;
        this.registerForm.reset();
        this.otpForm.reset();
        this.submitted = false;

        setTimeout(() => {
          this.router.navigate(['/user-profile']);
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }
}