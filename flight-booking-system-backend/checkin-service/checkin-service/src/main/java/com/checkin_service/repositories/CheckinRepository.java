package com.checkin_service.repositories;

import com.checkin_service.dto.CheckinResponseDTO;
import com.checkin_service.model.Checkin;
import com.checkin_service.model.SeatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CheckinRepository extends JpaRepository<Checkin, Long> {
    @Query("SELECT MAX(c.lastSeat) FROM checkins c WHERE c.seatType = :seatType")
    Integer findMaxLastSeatBySeatType(SeatType seatType);
    Optional<Checkin> findByBookingIdAndUsername(String bookingId, String username);
}
