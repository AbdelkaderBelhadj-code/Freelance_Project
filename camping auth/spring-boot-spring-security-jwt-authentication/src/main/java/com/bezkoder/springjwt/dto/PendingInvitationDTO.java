package com.bezkoder.springjwt.dto;

public class PendingInvitationDTO {
    private Long invitationId;
    private String eventTitle;
    private String userName;
    private String status;



    public PendingInvitationDTO() {

    }

    // Getters
    public Long getInvitationId() {
        return invitationId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public String getUserName() {
        return userName;
    }

    public String getStatus() {
        return status;
    }

    // Setters
    public void setInvitationId(Long invitationId) {
        this.invitationId = invitationId;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
