import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SeatType } from '../../model/SeatType';
import { FlightSearchService } from '../../services/flight-search.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-flight',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.scss'],
})
export class AddFlightComponent {
  flightForm: FormGroup;
  seatTypes = Object.values(SeatType);
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private flightService: FlightSearchService,
    private router: Router
  ) {
    this.flightForm = this.fb.group({
      airline: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
      departureTime: ['', Validators.required],
      fareDetails: this.fb.group({
        priceDetails: this.fb.group(
          this.seatTypes.reduce((acc, type) => {
            acc[type] = [null, [Validators.required, Validators.min(0.01)]];
            return acc;
          }, {} as any)
        ),
      }),
    });
  }

  onSubmit(): void {
    if (this.flightForm.invalid) {
      this.flightForm.markAllAsTouched();
      return;
    }

    this.flightService.addFlight(this.flightForm.value).subscribe({
      next: (res: any) => {
        this.successMessage = `Flight ${res.flightNumber} added successfully!`;
        this.errorMessage = '';
        this.flightForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error) {
          this.errorMessage = Object.values(err.error).join(', ');
        } else {
          this.errorMessage = err.error?.message || 'Something went wrong!';
        }
        this.successMessage = '';
      },
    });
  }

  getControl(path: string) {
    return this.flightForm.get(path);
  }
  goBackToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}