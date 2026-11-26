import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-booking-list',
  imports: [CommonModule],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss'
})
export class BookingListComponent implements OnInit {
  bookings: any[] = [];
  errorMessage = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getAllBookings().subscribe({
      next: (res) => {
        this.bookings = res;
        this.errorMessage = '';
      },
      error: (err) => {
        this.bookings = [];
        this.errorMessage = err.error?.message || 'Failed to fetch bookings.';
      }
    });
  }
}