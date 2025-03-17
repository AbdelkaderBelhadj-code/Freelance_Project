package com.bezkoder.springjwt.models;

import jakarta.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @OneToMany(mappedBy = "event")
    private Set<EventInvitation> eventInvitations = new HashSet<>();

    @ManyToMany(mappedBy = "events")
    private Set<User> users = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "created_by")  // New field for creator
    private User createdBy;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    public Set<User> getUsers() { return users; }
    public void setUsers(Set<User> users) { this.users = users; }

    public Set<User> getAcceptedUsers() {
        return eventInvitations.stream()
                .filter(invitation -> invitation.getStatus() == EventInvitation.InvitationStatus.ACCEPTED)
                .map(EventInvitation::getUser)
                .collect(Collectors.toSet());
    }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
}
