import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-booking',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-booking.component.html',
  styleUrl: './my-booking.component.scss'
})

export class MyBookingComponent {

  bookings: any[] = [];
  bookingError = '';

  constructor(private bookingService: BookingService) {}

  isUserLoggedIn = false
  
 
  ngOnInit(): void {

    const token = localStorage.getItem('token');
    
    if (token) {
      this.isUserLoggedIn = true;
    }
    this.bookingService.getUserBookings().subscribe({
      next: (res) => {
        this.bookings = res;
        this.bookingError = '';
      },
      error: (err) => {
        this.bookings = [];
        this.bookingError = err.error?.message || 'Failed to fetch bookings.';
      }
    });
  }


  clearError(): void {
    this.bookingError = '';
  }
}