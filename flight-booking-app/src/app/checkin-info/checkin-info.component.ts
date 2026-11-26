import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CheckinResponseDTO, CheckinService } from '../services/checkin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkin-info',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkin-info.component.html',
  styleUrl: './checkin-info.component.scss'
})
export class CheckinInfoComponent {


  constructor(private checkinService: CheckinService) {}

  bookingId=''
  checkinInfo?: CheckinResponseDTO;
  errorMessage = ''
  isUserLoggedIn = false
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.isUserLoggedIn = true;
    }
  }

  fetchCheckinInfo(): void {
    this.checkinService.getCheckinInfo(this.bookingId).subscribe({
      next: (data) => {
        this.checkinInfo = data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Check-in info not found';
        this.checkinInfo = undefined;
      }
    });
  }

}