package com.checkin_service;


import com.checkin_service.controlller.CheckinController;
import com.checkin_service.dto.CheckinResponseDTO;
import com.checkin_service.model.SeatType;
import com.checkin_service.service.CheckinService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
		import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
		import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CheckinController.class)
class CheckinServiceApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private CheckinService checkinService;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void testCheckinPassenger() throws Exception {
		String bookingId = "BOOK123";
		String username = "user123";

		CheckinResponseDTO mockResponse = CheckinResponseDTO.builder()
				.checkinId(1L)
				.bookingId(bookingId)
				.seatType(SeatType.ECONOMY_CLASS)
				.noOfSeats(2)
				.assignedSeats(List.of("EC-001", "EC-002"))
				.build();

		Mockito.when(checkinService.checkinPassenger(bookingId, username))
				.thenReturn(mockResponse);

		mockMvc.perform(post("/api/checkin/{bookingId}", bookingId)
						.header("X-Username", username))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.bookingId").value(bookingId))
				.andExpect(jsonPath("$.assignedSeats", hasSize(2)));
	}

	@Test
	void testGetAllCheckins() throws Exception {
		List<CheckinResponseDTO> mockList = List.of(
				CheckinResponseDTO.builder()
						.checkinId(1L)
						.bookingId("BOOK001")
						.seatType(SeatType.BUSINESS_CLASS)
						.noOfSeats(1)
						.assignedSeats(List.of("BU-010"))
						.build()
		);

		Mockito.when(checkinService.getAllCheckins()).thenReturn(mockList);

		mockMvc.perform(get("/api/checkin/all"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.size()", is(1)))
				.andExpect(jsonPath("$[0].bookingId").value("BOOK001"));
	}
}
