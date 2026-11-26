import { Component } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {
  bookingRequest = {
    name: '',
    email: '',
    contact: '',
    flightNumber: '',
    seatType: 'ECONOMY_CLASS',
    noOfSeats: 1,
    currency: 'INR'
  };

  bookingResponse: any = null;
  bookingError = '';
  isUserLoggedIn = false
  
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.isUserLoggedIn = true;
    }
  }
  
  
constructor(private route: ActivatedRoute, private bookingService: BookingService) {
    this.route.queryParams.subscribe(params => {
      this.bookingRequest.flightNumber = params['flightNumber'];
    });
  }

  createBooking(): void {

    this.bookingService.createBooking(this.bookingRequest).subscribe({
      next: (res) => {
        this.bookingResponse = res;
        this.bookingError = '';

        this.bookingRequest = {
          name: '',
          email: '',
          contact: '',
          flightNumber: '',
          seatType: 'ECONOMY_CLASS',
          noOfSeats: 1,
          currency: 'INR'
        };

          if (res.paymentUrl) {
            window.location.href = res.paymentUrl;
          }
        

      },
      error: (err) => {
      this.bookingError = err.error?.message || 'Booking failed.';
      this.bookingResponse = null;
    }

    });
  }

  clearError(): void {
    this.bookingError = '';
  }
}