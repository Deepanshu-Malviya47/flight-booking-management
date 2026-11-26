import { Component } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-info',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './booking-info.component.html',
  styleUrl: './booking-info.component.scss'
})
export class BookingInfoComponent {
  bookingId = '';
  booking: any = null;
  bookingError = '';
  touched = false;

  constructor(private bookingService: BookingService) {}

  isUserLoggedIn = false
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.isUserLoggedIn = true;
    }
  }
  fetchBooking(): void {
    this.touched = true;

    if (!this.bookingId.trim()) {
      this.bookingError = 'Booking ID is required.';
      this.booking = null;
      return;
    }

    this.bookingService.getBookingById(this.bookingId.trim()).subscribe({
      next: (res) => {
        this.booking = res;
        this.bookingError = '';
      },
      error: (err) => {
        this.booking = null;
        this.bookingError = err.error?.message || 'Failed to fetch booking.';
      }
    });
  }
}