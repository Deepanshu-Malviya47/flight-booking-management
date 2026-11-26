import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  registerUser(payload: any, role: string): Observable<string> {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    if (role === 'ADMIN' && token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post(`${this.baseUrl}/register/${role.toLowerCase()}`, payload, {
      headers,
      responseType: 'text' as const
    }).pipe(
      catchError(this.handleError)
    );
  }

  verifyOtp(payload: any, otp: string, role: string): Observable<string> {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    if (role === 'ADMIN' && token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post(`${this.baseUrl}/verify-otp/${role.toLowerCase()}?otp=${otp}`, payload, {
      headers,
      responseType: 'text' as const
    }).pipe(
      catchError(this.handleError)
    );
  
  }

  login(payload: { username: string; password: string }, role: string): Observable<{ username: string; token: string }> {
    return this.http.post<{ username: string; token: string }>(
      `${this.baseUrl}/login/${role.toLowerCase()}`,
      payload
    );
  }
  forgotPassword(email: string, role: string): Observable<string> {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    if (role === 'ADMIN' && token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post(`${this.baseUrl}/reset-password/${role.toLowerCase()}?email=${email}`, null, {
      headers,
      responseType: 'text' as const
    });
  }

  verifyResetPassword(payload: any, role: string): Observable<string> {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    if (role === 'ADMIN' && token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.put(`${this.baseUrl}/reset/verify-otp/${role.toLowerCase()}`, payload, {
      headers,
      responseType: 'text' as const
    }).pipe(
      catchError(this.handleError)
    );
  }


  deleteUser(password: string, role: string): Observable<string> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params = { password };

    return this.http.delete(`${this.baseUrl}/delete/${role.toLowerCase()}`, {
      headers,
      params,
      responseType: 'text' as const
    }).pipe(
      catchError(this.handleError)
    );
  }

  getUserInfo(): Observable<{ username: string; email: string; role: string }> {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<{ username: string; email: string; role: string }>(
      `${this.baseUrl}/get/info`,  { headers } );
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getUsersByRole(role: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all/${role}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    const message = error.error || 'An error occurred';
    return throwError(() => message);
  }

}