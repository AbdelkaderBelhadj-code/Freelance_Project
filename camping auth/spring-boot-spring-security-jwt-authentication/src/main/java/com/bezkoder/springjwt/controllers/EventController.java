package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.dto.EventDTO;
import com.bezkoder.springjwt.dto.EventStatusDTO;
import com.bezkoder.springjwt.dto.PendingInvitationDTO;
import com.bezkoder.springjwt.models.Event;
import com.bezkoder.springjwt.models.EventInvitation;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody EventDTO eventDTO) {
        Event event = eventService.createEvent(eventDTO);
        return ResponseEntity.ok(event);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Event> getEvent(@PathVariable Long id) {
        return eventService.getEvent(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{eventId}/remove-user/{userId}")
    public ResponseEntity<?> removeUserFromEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        try {
            Event event = eventService.getEvent(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));

            User user = eventService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            EventInvitation invitation = eventService.getInvitation(eventId, userId);

            if (invitation == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No invitation found for user " + userId + " in event " + eventId);
            }

            eventService.deleteUserInvitation(eventId, userId);
            return ResponseEntity.ok().body("User successfully removed from event");

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }



    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody EventDTO eventDTO) {
        Event event = eventService.updateEvent(id, eventDTO);
        if (event != null) {
            return ResponseEntity.ok(event);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{eventId}/invite/{userId}")
    public ResponseEntity<Void> sendInvitation(@PathVariable Long eventId, @PathVariable Long userId) {
        eventService.sendInvitation(eventId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/invitation/{invitationId}/accept")
    public ResponseEntity<Void> acceptInvitation(@PathVariable Long invitationId) {
        eventService.acceptInvitation(invitationId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/invitation/{invitationId}/decline")
    public ResponseEntity<Void> declineInvitation(@PathVariable Long invitationId) {
        eventService.declineInvitation(invitationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/pending-invitations")
    public ResponseEntity<List<EventInvitation>> getPendingInvitations(@PathVariable Long userId) {
        List<EventInvitation> invitations = eventService.getPendingInvitations(userId);
        return ResponseEntity.ok(invitations);
    }

    // Get all events that a user has accepted
    @GetMapping("/user/{userId}/accepted-events")
    public ResponseEntity<List<Event>> getAcceptedEvents(@PathVariable Long userId) {
        List<Event> events = eventService.getAcceptedEvents(userId);
        return ResponseEntity.ok(events);
    }
    @PostMapping("/{eventId}/invite")
    public ResponseEntity<Void> sendInvitations(@PathVariable Long eventId, @RequestBody List<Long> userIds) {
        eventService.sendInvitations(eventId, userIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/accepted-invitations")
    public ResponseEntity<List<EventInvitation>> getAcceptedInvitations(@PathVariable Long userId) {
        List<EventInvitation> invitations = eventService.getAcceptedInvitations(userId);
        return ResponseEntity.ok(invitations);
    }

    @GetMapping("/user/{userId}/events-status")
    public ResponseEntity<List<EventStatusDTO>> getUserEventsStatus(@PathVariable Long userId) {
        List<EventStatusDTO> eventStatuses = eventService.getUserEventsStatus(userId);
        return ResponseEntity.ok(eventStatuses);
    }

    @GetMapping("/{eventId}/accepted-users")
    public ResponseEntity<List<String>> getAcceptedUsersUsernames(@PathVariable Long eventId) {
        List<String> usernames = eventService.getUsernamesWhoAcceptedEvent(eventId);
        return ResponseEntity.ok(usernames);
    }

    @GetMapping("/all-pending-invitations")
    public ResponseEntity<List<PendingInvitationDTO>> getAllPendingInvitations() {
        List<PendingInvitationDTO> invitations = eventService.getAllPendingInvitations();
        return ResponseEntity.ok(invitations);
    }


}