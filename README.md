# Flight Booking System

A full-stack flight booking application built with a **Spring Boot microservices** backend and an **Angular 19** frontend.

---

## Architecture

```
Angular Frontend (port 4200)
        |
   API Gateway (port 8080)
        |
   Eureka Server (port 8761)
   /    |    \    |    \    \
Auth  Flight Book Check Pay  Mail
8081  8083  8085  8086  8084  8082
```

All backend services register with Eureka for service discovery. The API Gateway handles routing, JWT authentication, and CORS.

---

## Services

| Service | Port | Database |
|---|---|---|
| Eureka Server | 8761 | — |
| API Gateway | 8080 | — |
| Auth Service | 8081 | `flight_booking_user_db` |
| Flight Search Service | 8083 | `flight_search_db` |
| Payment Service | 8084 | — (Razorpay) |
| Booking Service | 8085 | `flight_booking_db` |
| Checkin Service | 8086 | — |
| Mail Service | 8082 | — |

---

## Tech Stack

**Backend**
- Java + Spring Boot
- Spring Cloud Gateway, Eureka (Netflix OSS)
- Spring Security + JWT
- Spring Data JPA + MySQL
- Razorpay (payment integration)
- JavaMail (email notifications)
- OpenFeign (inter-service communication)

**Frontend**
- Angular 19
- TypeScript, RxJS
- Angular Router, Reactive Forms, HttpClient

---

## Prerequisites

- Java 17+
- Node.js 18+ & npm
- MySQL 8
- Maven

---

## Database Setup

Create the following MySQL databases:

```sql
CREATE DATABASE flight_booking_user_db;
CREATE DATABASE flight_search_db;
CREATE DATABASE flight_booking_db;
```

Default credentials used across services: `root / root`. Update `application.properties` in each service if yours differ.

---

## Running the Backend

Start services **in this order**:

```bash
# 1. Eureka Server
cd flight-booking-system-backend/eureka-server/eureka-server
./mvnw spring-boot:run

# 2. API Gateway
cd flight-booking-system-backend/api-gateway/api-gateway
./mvnw spring-boot:run

# 3. All other services (in any order)
cd flight-booking-system-backend/auth-service/auth-service && ./mvnw spring-boot:run
cd flight-booking-system-backend/flight-search-service/flight-search-service && ./mvnw spring-boot:run
cd flight-booking-system-backend/booking-service/booking-service && ./mvnw spring-boot:run
cd flight-booking-system-backend/checkin-service/checkin-service && ./mvnw spring-boot:run
cd flight-booking-system-backend/payment-service/payment-service && ./mvnw spring-boot:run
cd flight-booking-system-backend/mail-service/mail-service && ./mvnw spring-boot:run
```

Eureka dashboard: http://localhost:8761

---

## Running the Frontend

```bash
cd flight-booking-app
npm install
ng serve
```

App runs at: http://localhost:4200

---

## API Overview

All requests go through the API Gateway at `http://localhost:8080`.

| Prefix | Service |
|---|---|
| `/api/auth/**` | Auth Service |
| `/api/flights/**` | Flight Search Service |
| `/api/bookings/**` | Booking Service |
| `/api/checkin/**` | Checkin Service |
| `/api/payment/**` | Payment Service |
| `/api/mail/**` | Mail Service |

A Postman collection is included at the root: `flight booking.postman_collection.json`

---

## Features

**User**
- Register, login, reset password (OTP via email)
- Search and view flights
- Book flights, select seat type
- Online payment via Razorpay
- View and cancel bookings
- Online check-in
- Email confirmations for booking and check-in

**Admin**
- Separate admin login/register
- Add, update, delete flights
- View all users, bookings, and check-ins

---

## UML Diagrams

Architecture, ER, class, use case, and sequence diagrams are available in the `UML diagrams/` folder.

---

## Configuration Notes

- **JWT**: Configured in the API Gateway and Auth Service. Update the secret key in both if needed.
- **Razorpay**: Test keys are set in `payment-service/application.properties`. Replace with live keys for production.
- **Mail**: Configure SMTP credentials in `mail-service/application.properties`.
- **CORS**: The API Gateway allows requests from `http://localhost:4200` by default.
#
