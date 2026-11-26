import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://localhost:8080/api/bookings'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  createBooking(requestBody: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-booking`, requestBody, { headers: this.getAuthHeaders() });
  }

  confirmBooking(bookingId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${bookingId}/confirm`, {}, { headers: this.getAuthHeaders() });
  }
  getPaymentUrl(bookingId: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/payment-url/${bookingId}`, { headers: this.getAuthHeaders(), responseType: 'text' });
  }
  getUserBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/all`, { headers: this.getAuthHeaders() });
  }
  getBookingById(bookingId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${bookingId}`, { headers: this.getAuthHeaders() });
  }
  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`, {headers: this.getAuthHeaders()} );
  }
  cancelBooking(bookingId: string, paymentId: string): Observable<string> {
    const url = `${this.baseUrl}/${bookingId}/cancel?paymentId=${paymentId}`;
    return this.http.put(url, null, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
  getPaymentId(bookingId: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/paymentId/${bookingId}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
}
