import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FlightSearchService } from '../../services/flight-search.service';

@Component({
  selector: 'app-common-list',
  imports: [CommonModule],
  templateUrl: './common-list.component.html',
  styleUrl: './common-list.component.scss'
})
export class CommonListComponent {

  flights: any[] = [];
  errorMessage = '';

  constructor(private http: HttpClient, private flightService: FlightSearchService) {}

  ngOnInit(): void {
    this.flightService.getAllFlights().subscribe({
      next: (data) => this.flights = data,
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load flights.';
      }
    });
  }
  
}
