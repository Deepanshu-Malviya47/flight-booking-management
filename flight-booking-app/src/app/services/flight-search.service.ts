import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FlightSearchService {
  private baseUrl = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) {}

  searchFlights(payload: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/search`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  addFlight(flightData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log('JWT Token:', token);
    return this.http.post(`${this.baseUrl}/add`, flightData, { headers });
  }


  getAllFlights(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.baseUrl}/all`, { headers });
  }
  deleteFlightByFlightNumber(flightNumber: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.baseUrl}/delete/${flightNumber}`, { headers, responseType: 'text' }).pipe(catchError(this.handleError));
  }
  updateFlightByFlightNumber(flightNumber: string, flightRequestDto: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.baseUrl}/update/${flightNumber}`, flightRequestDto, {
    headers,
    responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );;
  }
  getFlightByFlightNumber(flightNumber: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/get/${flightNumber}`, { headers}).pipe(
      catchError(this.handleError)
    );
  }
private handleError(error: HttpErrorResponse) {
  const message =
    error.error?.message ||
    error.statusText ||
    'Something went wrong. Please try again.';
  return throwError(() => new Error(message));
}
}