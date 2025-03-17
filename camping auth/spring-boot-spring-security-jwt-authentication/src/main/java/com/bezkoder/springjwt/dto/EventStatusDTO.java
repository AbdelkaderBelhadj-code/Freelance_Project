package com.bezkoder.springjwt.dto;

import com.bezkoder.springjwt.models.EventInvitation.InvitationStatus;

public class EventStatusDTO {

    private Long eventId;
    private InvitationStatus status;

    // Getters and Setters
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public InvitationStatus getStatus() {
        return status;
    }

    public void setStatus(InvitationStatus status) {
        this.status = status;
    }
}
