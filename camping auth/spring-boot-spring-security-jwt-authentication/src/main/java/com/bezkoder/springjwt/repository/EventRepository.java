package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.Event;
import com.bezkoder.springjwt.models.EventInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT e FROM EventInvitation e WHERE e.event.id = :eventId AND e.user.id = :userId")
    List<EventInvitation> findByEventIdAndUserId(@Param("eventId") Long eventId, @Param("userId") Long userId);


}

