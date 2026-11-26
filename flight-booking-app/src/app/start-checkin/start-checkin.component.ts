// src/app/components/start-checkin/start-checkin.component.ts
import { Component } from '@angular/core';
import { CheckinService, CheckinResponseDTO } from '../services/checkin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-start-checkin',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './start-checkin.component.html',
  styleUrls: ['./start-checkin.component.scss']
})
export class StartCheckinComponent {
  bookingId: string = '';
  checkinResult?: CheckinResponseDTO;
  errorMessage: string = '';



  constructor(private checkinService: CheckinService) {}

  isUserLoggedIn = false
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.isUserLoggedIn = true;
    }
  }

  startCheckin(): void {
    this.checkinService.checkinPassenger(this.bookingId).subscribe({
      next: (response) => {
        this.checkinResult = response;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Check-in failed';
        this.checkinResult = undefined;
      }
    });
  }
}