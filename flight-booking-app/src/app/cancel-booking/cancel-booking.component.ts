import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cancel-booking',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cancel-booking.component.html',
  styleUrl: './cancel-booking.component.scss'
})
export class CancelBookingComponent {
  bookingId = '';
  paymentId = '';
  cancelMessage = '';
  cancelError = '';
  touched = false;
  isUserLoggedIn = false

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.isUserLoggedIn = true;
    }
  }
  resetCancelError() {
    this.cancelError=''
    this.cancelMessage=''
  }
  getPaymentId() {
    this.bookingService.getPaymentId(this.bookingId).subscribe({
      next: (res) => {
        this.paymentId = res;
      },
       error: (err) => {
    if (err.status === 404) {
      this.cancelError = err.error?.message || 'Booking not found or payment not initiated.';
    } else {
      this.cancelError = 'Something went wrong. Please try again.';
    }
  }

    });
  }

  cancelBooking(): void {
    this.touched = true;
    this.getPaymentId();

    if (!this.bookingId.trim()) {
      this.cancelError = 'Booking ID is required.';
      this.cancelMessage = '';
      return;
    }

    this.bookingService.cancelBooking(this.bookingId.trim(), this.paymentId).subscribe({
      next: (res) => {
        this.cancelMessage = res;
        this.cancelError = '';
      },
      error: (err) => {
        this.cancelMessage = '';
        this.cancelError = err.error?.message || 'Failed to cancel booking.';
      }
    });
  }

}

