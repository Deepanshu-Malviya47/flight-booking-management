import { Component } from '@angular/core';
import { FlightSearchService } from '../services/flight-search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-flight-info',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './flight-info.component.html',
  styleUrl: './flight-info.component.scss'
})
export class FlightInfoComponent {

  isUserLoggedIn = false

  constructor(private flightService: FlightSearchService) {

  }

  
  flightNumberToView = '';
  flightInfo: any = null;
  flightInfoError = '';

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.isUserLoggedIn = true;
    }
  }
  viewFlightInfo(): void {
    if (!this.flightNumberToView.trim()) {
      this.flightInfoError = 'Flight number must not be blank.';
      return;
    }

    this.flightService.getFlightByFlightNumber(this.flightNumberToView.trim()).subscribe({
      next: (data) => {
        this.flightInfo = data;
        this.flightInfoError = '';
      },
      error: (err) => {
        this.flightInfoError = err.error?.message || 'Flight not found.';
        this.flightInfo = null;
      }
    });
  }

  clearFlightError(): void {
    this.flightInfoError = '';
  }

}
