import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  flightDropdownOpen = false;
  bookingDropdownOpen = false;
  checkinDropdownOpen = false;

  toggleFlightDropdown(): void {
    this.flightDropdownOpen = !this.flightDropdownOpen;
  }
  toggleBookingDropdown(): void {
    this.bookingDropdownOpen = !this.bookingDropdownOpen;
  }

  toggleCheckinDropdown(): void {
    this.checkinDropdownOpen = !this.checkinDropdownOpen;
  }

}
