// src/app/services/checkin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CheckinResponseDTO {
  checkinId: number;
  bookingId: string;
  seatType: string;
  noOfSeats: number;
  assignedSeats: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CheckinService {
   private baseUrl = 'http://localhost:8080/api/checkin'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }


  checkinPassenger(bookingId: string): Observable<CheckinResponseDTO> {

    return this.http.post<CheckinResponseDTO>(`${this.baseUrl}/${bookingId}`, {}, { headers: this.getAuthHeaders() });
  }

  getCheckinInfo(bookingId: string): Observable<CheckinResponseDTO> {
  
    return this.http.get<CheckinResponseDTO>(`${this.baseUrl}/get/${bookingId}`, { headers: this.getAuthHeaders() });
  }

  getAllCheckins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`, {headers: this.getAuthHeaders()});
  }

}