package com.bezkoder.springjwt.services;


import com.bezkoder.springjwt.dto.EventDTO;
import com.bezkoder.springjwt.dto.EventStatusDTO;
import com.bezkoder.springjwt.dto.PendingInvitationDTO;
import com.bezkoder.springjwt.models.Event;
import com.bezkoder.springjwt.models.EventInvitation;
import com.bezkoder.springjwt.models.Location;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.repository.EventInvitationRepository;
import com.bezkoder.springjwt.repository.EventRepository;
import com.bezkoder.springjwt.repository.LocationRepository;
import com.bezkoder.springjwt.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
@Transactional
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventInvitationRepository eventInvitationRepository;

    @Autowired
    private UserService userService; // Assuming you have a UserService

    public Event createEvent(EventDTO eventDTO) {
        Event event = new Event();
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setDate(eventDTO.getDate());

        if (eventDTO.getLocationId() != null) {
            Optional<Location> location = locationRepository.findById(eventDTO.getLocationId());
            location.ifPresent(event::setLocation);
        }

        return eventRepository.save(event);
    }



    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public EventInvitation getInvitation(Long eventId, Long userId) {
        return eventInvitationRepository.findByEventIdAndUserId(eventId, userId);
    }


    public List<User> getAcceptedUsersForEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id " + eventId));
        return new ArrayList<>(event.getAcceptedUsers());
    }

    public void deleteUserInvitation(Long eventId, Long userId) {
        // Find the invitation for the user and event
        EventInvitation invitation = eventInvitationRepository.findByEventIdAndUserId(eventId, userId);

        if (invitation != null) {
            eventInvitationRepository.delete(invitation);  // Delete the invitation
        } else {
            throw new RuntimeException("Invitation not found");
        }
    }


    // Get Event by ID
    public Optional<Event> getEvent(Long id) {
        return eventRepository.findById(id);
    }

    // Get All Events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Update Event
    public Event updateEvent(Long id, EventDTO eventDTO) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            event.setTitle(eventDTO.getTitle());
            event.setDescription(eventDTO.getDescription());
            event.setDate(eventDTO.getDate());

            if (eventDTO.getLocationId() != null) {
                Optional<Location> location = locationRepository.findById(eventDTO.getLocationId());
                location.ifPresent(event::setLocation);
            }

            return eventRepository.save(event);
        }
        return null;
    }

    // Delete Event
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    // Send Invitation to a User for an Event
    public void sendInvitation(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userService.getUserById(userId); // Assume method to fetch user

        EventInvitation invitation = new EventInvitation();
        invitation.setEvent(event);
        invitation.setUser(user);
        invitation.setStatus(EventInvitation.InvitationStatus.PENDING);
        invitation.setInvitationDate(new java.util.Date());

        eventInvitationRepository.save(invitation);
    }

    public void sendInvitations(Long eventId, List<Long> userIds) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<User> users = userService.getUsersByIds(userIds); // Assume method to fetch multiple users

        List<EventInvitation> invitations = users.stream()
                .map(user -> {
                    EventInvitation invitation = new EventInvitation();
                    invitation.setEvent(event);
                    invitation.setUser(user);
                    invitation.setStatus(EventInvitation.InvitationStatus.PENDING);
                    invitation.setInvitationDate(new java.util.Date());
                    return invitation;
                })
                .collect(Collectors.toList());

        eventInvitationRepository.saveAll(invitations);
    }


    // Accept Invitation for an Event
    public void acceptInvitation(Long eventInvitationId) {
        EventInvitation invitation = eventInvitationRepository.findById(eventInvitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        invitation.setStatus(EventInvitation.InvitationStatus.ACCEPTED);
        eventInvitationRepository.save(invitation);

        // Add User to Event after accepting invitation
        Event event = invitation.getEvent();
        User user = invitation.getUser();
        event.getUsers().add(user);
        eventRepository.save(event);
    }

    // Decline Invitation for an Event
    public void declineInvitation(Long eventInvitationId) {
        EventInvitation invitation = eventInvitationRepository.findById(eventInvitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        invitation.setStatus(EventInvitation.InvitationStatus.DECLINED);
        eventInvitationRepository.save(invitation);
    }

    public List<EventInvitation> getPendingInvitations(Long userId) {
        return eventInvitationRepository.findByUserIdAndStatus(userId, EventInvitation.InvitationStatus.PENDING);
    }

    public List<EventInvitation> getAcceptedInvitations(Long userId) {
        return eventInvitationRepository.findByUserIdAndStatus(userId, EventInvitation.InvitationStatus.ACCEPTED);
    }


    // **Get all events that a user has accepted**
    public List<Event> getAcceptedEvents(Long userId) {
        List<EventInvitation> acceptedInvitations = eventInvitationRepository.findByUserIdAndStatus(userId, EventInvitation.InvitationStatus.ACCEPTED);
        return acceptedInvitations.stream().map(EventInvitation::getEvent).collect(Collectors.toList());
    }

    public List<User> getUsersWhoAcceptedEvent(Long eventId) {
        return eventInvitationRepository.findByEventIdAndStatus(eventId, EventInvitation.InvitationStatus.ACCEPTED)
                .stream()
                .map(invitation -> invitation.getUser())
                .collect(Collectors.toList());
    }


    // Get the status of all events for a specific user
    public List<EventStatusDTO> getUserEventsStatus(Long userId) {
        List<EventInvitation> invitations = eventInvitationRepository.findByUserId(userId);

        return invitations.stream()
                .map(invitation -> {
                    EventStatusDTO dto = new EventStatusDTO();
                    dto.setEventId(invitation.getEvent().getId());
                    dto.setStatus(invitation.getStatus());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<String> getUsernamesWhoAcceptedEvent(Long eventId) {
        // Get the accepted users for the event
        Set<User> acceptedUsers = eventRepository.findById(eventId)
                .map(Event::getAcceptedUsers)  // Assuming Event has a method to get accepted users
                .orElse(Collections.emptySet());  // Use an empty Set instead of an empty List

        // Convert the Set<User> to List<String> containing usernames
        return acceptedUsers.stream()
                .map(User::getUsername)  // Assuming User has a getUsername method
                .collect(Collectors.toList());
    }

    public List<PendingInvitationDTO> getAllPendingInvitations() {
        List<EventInvitation> pendingInvitations = eventInvitationRepository.findByStatus(EventInvitation.InvitationStatus.PENDING);

        List<PendingInvitationDTO> dtoList = new ArrayList<>();
        for (EventInvitation invitation : pendingInvitations) {
            PendingInvitationDTO dto = new PendingInvitationDTO();
            dto.setInvitationId(invitation.getId());
            dto.setEventTitle(invitation.getEvent().getTitle()); // assuming Event entity has a `getTitle()` method
            dto.setUserName(invitation.getUser().getUsername()); // assuming User entity has a `getUsername()` method
            dto.setStatus(invitation.getStatus().toString());

            dtoList.add(dto);
        }

        return dtoList;
    }


}
