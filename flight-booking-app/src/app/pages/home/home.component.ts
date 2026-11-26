import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FlightSearchService } from '../../services/flight-search.service';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  searchForm: FormGroup;
  flights: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  searched: boolean = false;

  seatTypes: string[] = [
    'ECONOMY_CLASS',
    'BUSINESS_CLASS',
    'FIRST_CLASS',
    'PREMIUM_CLASS'
  ];

  constructor(private fb: FormBuilder, private flightService: FlightSearchService, private router: Router) {
    this.searchForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  formatSeatType(seat: string): string {
    return seat.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  onSubmit(event?: Event): void {
    event?.preventDefault(); // Prevent native form submission

    if (this.searchForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.flights = [];
    this.searched = false;

    this.flightService.searchFlights(this.searchForm.value).subscribe({
      next: (data) => {
        this.loading = false;
        this.searched = true;

        if (Array.isArray(data) && data.length > 0) {
          this.flights = data;
        } else {
          this.errorMessage = 'No flights found.';
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.searched = true;

        if (error.status === 400 && typeof error.error === 'object') {
          this.errorMessage = Object.values(error.error).join(' | ');
        } else {
          this.errorMessage = error.error?.message || 'Unexpected error occurred.';
        }
      }
    });
  }

  
  goToBooking(flightNumber: string) {
      this.router.navigate(['/book-flight'], { queryParams: { flightNumber } });
  }

}