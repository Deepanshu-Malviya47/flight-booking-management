package com.mail_service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mail_service.controller.MailController;
import com.mail_service.dto.BookingMailRequest;
import com.mail_service.dto.CheckinMailRequestDTO;
import com.mail_service.service.MailService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MailController.class)
class MailControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MailService mailService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGenerateAndSendOtp() throws Exception {
        mockMvc.perform(post("/api/mail/generate-and-send-otp")
                        .param("email", "test@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("OTP sent successfully to test@example.com"));
    }

    @Test
    void testVerifyOtpTrue() throws Exception {
        Mockito.when(mailService.verifyOtp("test@example.com", "123456"))
                .thenReturn(true);

        mockMvc.perform(post("/api/mail/verify-otp")
                        .param("email", "test@example.com")
                        .param("otp", "123456"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void testSendBookingMail() throws Exception {
        BookingMailRequest request = BookingMailRequest.builder()
                .bookingId("BOOK123")
                .name("Alice")
                .email("alice@example.com")
                .contact("1234567890")
                .flightNumber("FL001")
                .bookingStatus("CONFIRMED")
                .seatType("ECONOMY_CLASS")
                .noOfSeats(2)
                .paymentStatus("PAID")
                .paymentId("PAY123")
                .build();

        mockMvc.perform(post("/api/mail/send-booking-mail")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Booking email sent to alice@example.com"));
    }

    @Test
    void testSendCancellationMail() throws Exception {
        mockMvc.perform(post("/api/mail/send-cancellation-mail")
                        .param("email", "bob@example.com")
                        .param("bookingId", "BOOK456"))
                .andExpect(status().isOk())
                .andExpect(content().string("Cancellation email sent to bob@example.com"));
    }

    @Test
    void testSendCheckinMail() throws Exception {
        CheckinMailRequestDTO dto = new CheckinMailRequestDTO(
                "BOOK789", 1L, "eve@example.com", List.of("E1", "E2")
        );

        Mockito.when(mailService.sendCheckinMail(Mockito.any())).thenReturn("Checkin mail sent successfully.");

        mockMvc.perform(post("/api/mail/send-checkin-mail")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("Checkin mail sent successfully."));
    }
}