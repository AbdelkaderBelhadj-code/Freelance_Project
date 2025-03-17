package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.EventInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventInvitationRepository extends JpaRepository<EventInvitation, Long> {
    List<EventInvitation> findByUserIdAndStatus(Long userId, EventInvitation.InvitationStatus invitationStatus);

    List<EventInvitation> findByEventIdAndStatus(Long eventId, EventInvitation.InvitationStatus status);

    List<EventInvitation> findByUserId(Long userId);

    List<EventInvitation> findByStatus(EventInvitation.InvitationStatus invitationStatus);

    EventInvitation findByEventIdAndUserId(Long eventId, Long userId);
}
