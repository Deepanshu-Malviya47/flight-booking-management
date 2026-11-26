import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserListComponent } from '../user-list/user-list.component';
import { CommonListComponent } from '../common-list/common-list.component';
import { FlightSearchService } from '../../services/flight-search.service';
import { FormsModule } from '@angular/forms';
import { SeatType } from '../../model/SeatType';
import { BookingListComponent } from '../booking-list/booking-list.component';
import { CheckinListComponent } from '../checkin-list/checkin-list.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, UserListComponent, CommonListComponent, FormsModule, BookingListComponent, CheckinListComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  constructor(private router: Router, private flightService: FlightSearchService) {}

  showAll = false;
  showUsers = false;
  showAdmins = false;
  showFlights = false;
  showDeleteFlight = false;
  showUpdateFlight = false;
  showBookings = false;
  showCheckins = false;


  flightNumberToDelete = '';
  deleteSuccess = '';
  deleteError = '';

  flightNumberToUpdate = '';
  updatedAirline = '';
  updatedFareDetails: { [key: string]: number } = {};
  updateSuccess = '';
  updateError = '';
  seatTypes = Object.values(SeatType);

  showFlightInfo = false;
  flightNumberToView = '';
  flightInfo: any = null;
  flightInfoError = '';

  toggleView(view: string): void {
    this.showAll = view === 'ALL';
    this.showUsers = view === 'USER';
    this.showAdmins = view === 'ADMIN';
    this.showFlights = view === 'FLIGHTS';
    this.showDeleteFlight = false;
    this.showUpdateFlight = false;
    this.showFlightInfo = false;
    this.showBookings = view === 'BOOKINGS';
    this.showCheckins = view === 'CHECKINS'; 

  }

  navigateToRegisterAdmin(): void {
    window.location.href = '/admin/register';
  }

  navigateToAddFlight(): void {
    this.router.navigate(['/admin/add-flight']);
  }

  toggleDeleteFlight(): void {
    this.resetViews();
    this.showDeleteFlight = true;
    this.deleteSuccess = '';
    this.deleteError = '';
  }

  toggleUpdateFlight(): void {
    this.resetViews();
    this.showUpdateFlight = true;
    this.updateSuccess = '';
    this.updateError = '';
    this.updatedFareDetails = {};
  }

  resetViews(): void {
    this.showAll = false;
    this.showUsers = false;
    this.showAdmins = false;
    this.showFlights = false;
    this.showDeleteFlight = false;
    this.showUpdateFlight = false;
    this.showFlightInfo = false;
    this.showCheckins = false;
  }

  deleteFlight(): void {
    if (!this.flightNumberToDelete.trim()) {
      this.deleteError = 'Flight number must not be blank.';
      return;
    }

    this.flightService.deleteFlightByFlightNumber(this.flightNumberToDelete.trim()).subscribe({
      next: (res: any) => {
        this.deleteSuccess = res;
        this.deleteError = '';
        this.flightNumberToDelete = '';
        setTimeout(() => {
          this.showDeleteFlight = false;
        }, 2000);
      },
      error: (err) => {
        this.deleteError = err.message || 'Failed to delete flight.';
        this.deleteSuccess = '';
      }
    });
  }

  updateFlight(): void {
    if (!this.flightNumberToUpdate.trim()) {
      this.updateError = 'Flight number must not be blank.';
      return;
    }

    if (!this.updatedAirline.trim()) {
      this.updateError = 'Airline name must not be blank.';
      return;
    }

    const flightRequestDto = {
      airline: this.updatedAirline.trim(),
      fareDetails: {
        priceDetails: this.updatedFareDetails
      }
    };

    this.flightService.updateFlightByFlightNumber(this.flightNumberToUpdate.trim(), flightRequestDto).subscribe({
      next: () => {
        this.updateSuccess = 'Flight updated successfully.';
        this.updateError = '';
        this.flightNumberToUpdate = '';
        this.updatedAirline = '';
        this.updatedFareDetails = {};
        setTimeout(() => {
          this.showUpdateFlight = false;
        }, 2000);
      },
      error: (err) => {
        this.updateError = err.message  || 'Failed to update flight.';
        this.updateSuccess = '';
      }
    });
  }

  toggleFlightInfo(): void {
    this.resetViews();
    this.showFlightInfo = true;
    this.flightInfo = null;
    this.flightInfoError = '';
    this.flightNumberToView = '';
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

  refreshPage(): void {
    window.location.reload();
  }

}