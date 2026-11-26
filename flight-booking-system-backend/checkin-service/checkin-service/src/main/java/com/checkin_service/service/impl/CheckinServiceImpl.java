package com.checkin_service.service.impl;

import com.checkin_service.dto.CheckinMailRequestDTO;
import com.checkin_service.external.MailServiceClient;
import com.checkin_service.repositories.CheckinRepository;
import com.checkin_service.dto.CheckinResponseDTO;
import com.checkin_service.external.BookingServiceClient;
import com.checkin_service.mapper.CheckinMapper;
import com.checkin_service.model.Booking;
import com.checkin_service.model.Checkin;
import com.checkin_service.model.SeatType;
import com.checkin_service.service.CheckinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CheckinServiceImpl implements CheckinService {

    private final BookingServiceClient bookingServiceClient;
    private final MailServiceClient mailServiceClient;
    private final CheckinRepository checkinRepository;


    public String buildSeatNumber(SeatType seatType, int seatNumber) {
        String seatAbbr = seatType.name().substring(0, 2).toUpperCase();
        return seatAbbr + "-" + String.format("%03d", seatNumber);
    }

    @Override
    public CheckinResponseDTO checkinPassenger(String bookingId, String username) {

        Booking booking = bookingServiceClient.getBookingByIdForUser(bookingId, username);

//        LocalDateTime checkinDateTime = LocalDateTime.now();
//        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
//
//        if(Long.parseLong(bookingId.substring(3, 11)+bookingId.substring(12, 16)) < Long.parseLong(dtf.format(checkinDateTime))) {
//            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Flight has been departed.");
//        }
//        if(Long.parseLong(bookingId.substring(3, 11)+bookingId.substring(12, 16))-Long.parseLong(dtf.format(checkinDateTime).substring(0, 8)) > 1) {
//            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Check-in is allowed only up to 24 hours before your scheduled time.");
//        }

        Checkin checkin = Checkin.builder()
                .bookingId(booking.getBookingId())
                .seatType(booking.getSeatType())
                .noOfSeats(booking.getNoOfSeats())
                .username(booking.getUsername())
                .build();

        Integer lastSeat = checkinRepository.findMaxLastSeatBySeatType(booking.getSeatType());

        if(lastSeat == null) {
            lastSeat = 0;
        }

        List<String> seats = new ArrayList<>();
        for(int i=1; i<=booking.getNoOfSeats(); i++) {
            seats.add(buildSeatNumber(booking.getSeatType(), lastSeat+i+1));
        }
        checkin.setAssignedSeats(seats);

        checkin.setLastSeat(lastSeat + booking.getNoOfSeats());

        checkin.setUsername(username);

        checkin = checkinRepository.save(checkin);

        CheckinMailRequestDTO mailRequest = new CheckinMailRequestDTO(
                checkin.getBookingId(),
                checkin.getCheckinId(),
                booking.getEmail(),
                checkin.getAssignedSeats()
        );

        bookingServiceClient.updateBookingStatusToCheckedIn(booking.getBookingId());
        mailServiceClient.sendCheckinMail(mailRequest);

        return CheckinMapper.toDto(checkin);
    }

    @Override
    public List<CheckinResponseDTO> getAllCheckins() {
        List<Checkin> checkins = checkinRepository.findAll();

        if (checkins.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No checkins available.");
        }
        return checkins.stream()
                .map(CheckinMapper::toDto)
                .toList();
    }
    @Override
    public CheckinResponseDTO getByBookingId(String bookingId, String username) {
        Optional<Checkin> checkinOptional = checkinRepository.findByBookingIdAndUsername(bookingId, username);
        if(checkinOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No checkin available for booking id: " + bookingId);
        }
        return CheckinMapper.toDto(checkinOptional.get());
    }
}
