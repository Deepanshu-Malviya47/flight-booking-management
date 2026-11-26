import { Component } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-confirm-booking',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './confirm-booking.component.html',
  styleUrl: './confirm-booking.component.scss'
})
export class ConfirmBookingComponent {

  constructor(private bookingService: BookingService, private router: Router) {}
  bookingIdToConfirm = '';
  confirmationResponse: any = null;
  bookingError = ''
  paymentUrl = ''
   
  paymentPending = false;

  isUserLoggedIn = false
  
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.isUserLoggedIn = true;
    }
  }
  

  confirmBooking(): void {
    this.bookingService.confirmBooking(this.bookingIdToConfirm).subscribe({
      next: (res) => {
        this.confirmationResponse = res;
        this.bookingError = '';
        this.paymentPending = res.paymentStatus === 'PENDING';
      },
      error: (err) => {
        this.bookingError = err.error?.message || 'Confirmation failed.';
        this.confirmationResponse = null;
        console.log(this.bookingError)
        this.paymentPending = this.bookingError === 'Payment not completed. Please complete payment to proceed.'
      }
    });
  }

  hitPaymentUrl(): void {
    
    this.bookingService.getPaymentUrl(this.bookingIdToConfirm).subscribe({
      next: (url) => {
        if (url) {
          console.log('Redirecting to:', url);
          window.location.href = url;

        } else {
          this.bookingError = 'No payment URL returned.';
        }
      },
      error: (err) => {
        this.bookingError = err.error?.message || 'Failed to retrieve payment URL.';
      }
    });
}
}
