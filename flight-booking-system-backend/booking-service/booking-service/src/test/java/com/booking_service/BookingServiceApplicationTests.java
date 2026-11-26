package com.booking_service;
import com.booking_service.controller.BookingController;
import com.booking_service.dto.CreateBookingRequest;
import com.booking_service.model.Booking;
import com.booking_service.model.BookingStatus;
import com.booking_service.model.PaymentStatus;
import com.booking_service.model.SeatType;
import com.booking_service.service.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
		import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingController.class)
class BookingServiceApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private BookingService bookingService;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void testCreateBooking() throws Exception {
		CreateBookingRequest request = new CreateBookingRequest();
		request.setName("John Doe");
		request.setEmail("john@example.com");
		request.setContact("1234567890");
		request.setFlightNumber("FL123");
		request.setSeatType(SeatType.ECONOMY_CLASS);
		request.setNoOfSeats(2);
		request.setCurrency("INR");

		Booking booking = Booking.builder()
				.id(1L)
				.bookingId("FL123-EC-0001")
				.name(request.getName())
				.email(request.getEmail())
				.contact(request.getContact())
				.flightNumber(request.getFlightNumber())
				.seatType(request.getSeatType())
				.noOfSeats(request.getNoOfSeats())
				.username("johndoe")
				.currency("INR")
				.bookingStatus(BookingStatus.PENDING)
				.paymentStatus(PaymentStatus.PENDING)
				.orderId("order_abc123")
				.paymentUrl("http://payment.url")
				.build();

		Mockito.when(bookingService.createBooking(Mockito.any(), Mockito.eq("johndoe"))).thenReturn(booking);

		mockMvc.perform(post("/api/bookings/create-booking")
						.header("X-Username", "johndoe")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.bookingId", is("FL123-EC-0001")));
	}

	@Test
	void testConfirmBooking() throws Exception {
		Booking booking = Booking.builder()
				.bookingId("BOOK123")
				.bookingStatus(BookingStatus.CONFIRMED)
				.username("johndoe")
				.build();

		Mockito.when(bookingService.confirmBooking("BOOK123", "johndoe")).thenReturn(booking);

		mockMvc.perform(post("/api/bookings/BOOK123/confirm")
						.header("X-Username", "johndoe"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.bookingId", is("BOOK123")))
				.andExpect(jsonPath("$.bookingStatus", is("CONFIRMED")));
	}

	@Test
	void testCancelBooking() throws Exception {
		Mockito.when(bookingService.cancelBooking("BOOK123", "johndoe"))
				.thenReturn("Booking with Booking Id BOOK123 cancelled successfully.");

		mockMvc.perform(put("/api/bookings/BOOK123/cancel")
						.header("X-Username", "johndoe"))
				.andExpect(status().isOk())
				.andExpect(content().string("Booking with Booking Id BOOK123 cancelled successfully."));
	}

	@Test
	void testGetBookingById() throws Exception {
		Booking booking = Booking.builder()
				.bookingId("BOOK123")
				.username("johndoe")
				.build();

		Mockito.when(bookingService.getBookingByIdForUser("BOOK123", "johndoe")).thenReturn(booking);

		mockMvc.perform(get("/api/bookings/user/BOOK123")
						.header("X-Username", "johndoe"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.bookingId", is("BOOK123")));
	}

	@Test
	void testGetAllBookings() throws Exception {
		Booking b = Booking.builder().bookingId("B1").build();
		Mockito.when(bookingService.getAllBookings()).thenReturn(List.of(b));

		mockMvc.perform(get("/api/bookings/all"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()", is(1)))
				.andExpect(jsonPath("$[0].bookingId", is("B1")));
	}
}
