import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminRegisterComponent } from './admin/admin-register/admin-register.component';
import { AddFlightComponent } from './admin/add-flight/add-flight.component';
import { FlightInfoComponent } from './flight-info/flight-info.component';
import { BookingComponent } from './booking/booking.component';
import { ConfirmBookingComponent } from './confirm-booking/confirm-booking.component';
import { MyBookingComponent } from './my-booking/my-booking.component';
import { BookingInfoComponent } from './booking-info/booking-info.component';
import { CancelBookingComponent } from './cancel-booking/cancel-booking.component';
import { StartCheckinComponent } from './start-checkin/start-checkin.component';
import { CheckinInfoComponent } from './checkin-info/checkin-info.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: UserProfileComponent },
    { path: 'admin/dashboard', component: AdminDashboardComponent},
    { path: 'admin/login', component: AdminLoginComponent },
    { path: 'admin/register', component: AdminRegisterComponent },
    { path: 'admin/add-flight', component: AddFlightComponent },
    { path: 'flight-info', component: FlightInfoComponent },
    { path: 'book-flight', component: BookingComponent },
    { path: 'confirm-booking', component: ConfirmBookingComponent },
    { path: 'my-bookings', component: MyBookingComponent },
    { path: 'booking-info', component: BookingInfoComponent },
    { path: 'cancel-booking', component: CancelBookingComponent },
    { path: 'checkin', component: StartCheckinComponent },
    { path: 'checkin-info', component: CheckinInfoComponent }

];
