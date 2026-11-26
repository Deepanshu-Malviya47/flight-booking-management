import { Component, OnInit } from '@angular/core';
import { CheckinService } from '../../services/checkin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkin-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkin-list.component.html',
  styleUrl: './checkin-list.component.scss'
})
export class CheckinListComponent implements OnInit {
  checkins: any[] = [];
  errorMessage = '';

  constructor(private checkinService: CheckinService) {}

  ngOnInit(): void {
    this.checkinService.getAllCheckins().subscribe({
      next: (res) => {
        this.checkins = res;
        this.errorMessage = '';
      },
      error: (err) => {
        this.checkins = [];
        this.errorMessage = err.error?.message || 'Failed to fetch check-ins.';
      }
    });
  }
}