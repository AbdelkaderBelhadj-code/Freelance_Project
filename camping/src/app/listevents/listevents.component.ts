import { Component, OnInit } from '@angular/core';
import { Event, EventInvitation, EventService } from '../services/EventService.service';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listevents',
  templateUrl: './listevents.component.html',
  styleUrls: ['./listevents.component.css']
})
export class ListeventsComponent implements OnInit {
  events: Event[] = [];
  userId: number | null = null;
  userAcceptedRequests: Set<number> = new Set();
  userPendingRequests: Set<number> = new Set();
  userRequestedToJoin: Set<number> = new Set();
  acceptedUsers: { [key: number]: string[] } = {};
  userInvitations: EventInvitation[] = [];  // Store user invitations as EventInvitation objects
  isOrganisateur: boolean = false; // To check if the current user is an Organisateur

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router // Inject Router service
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
    const user = this.authService.getCurrentUser();
    this.userId = user ? user.id : null;

    if (this.userId) {
      this.fetchUserEventsStatus();
    }

    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.roles.includes('Organisateur')) {
      this.isOrganisateur = true; // Set to true if the user is an Organisateur
    }

    // Load the invitation state from localStorage
    this.loadInvitationState();
  }

  fetchEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        events.forEach(event => {
          this.fetchAcceptedUsersForEvent(event.id);
        });
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire('Error', 'Failed to load events.', 'error');
        console.error(err);
      }
    });
  }

  deleteUserFromEvent(eventId: number, username: string) {
    this.eventService.getUserIdFromUsername(username).subscribe({
      next: (userId) => {
        this.eventService.deleteUserFromEvent(eventId, userId).subscribe({
          next: () => {
            Swal.fire('Success', 'User has been removed from the event.', 'success');
            
            // After user deletion, check if the current user is still part of the event
            if (this.userId && this.acceptedUsers[eventId].includes(username)) {
              // If the current user is not part of the event anymore, reset their status
              this.resetUserStatusForEvent(eventId);
            }
  
            // Refresh the accepted users list
            this.fetchAcceptedUsersForEvent(eventId);
          },
          error: (err: HttpErrorResponse) => {
            Swal.fire('Success', 'User has been removed from the event.', 'success');
            console.error(err);
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire('Success', 'User has been removed from the event.', 'success');
        console.error(err);
      }
    });
  }
  
  resetUserStatusForEvent(eventId: number) {
    // Reset the status of the current user for the event to "Requested to Join"
    if (this.userId) {
      this.userAcceptedRequests.delete(eventId); // Remove from accepted requests
      this.userPendingRequests.delete(eventId); // Remove from pending requests
      this.userRequestedToJoin.add(eventId); // Add to requested to join
  
      // Update event status to "Requested" in the UI
      const event = this.events.find(e => e.id === eventId);
      if (event) {
        event.status = 'REQUESTED';
      }
  
      // Save the updated state in localStorage
      this.updateInvitationStateInLocalStorage();
    }
  }

  fetchAcceptedUsersForEvent(eventId: number) {
    this.eventService.getAcceptedUsersForEvent(eventId).subscribe({
      next: (usernames) => {
        this.acceptedUsers[eventId] = usernames;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load accepted users for event:', err);
      }
    });
  }

  fetchUserEventsStatus() {
    if (!this.userId) return;

    this.eventService.getUserEventsStatus(this.userId).subscribe({
      next: (statuses) => {
        statuses.forEach(status => {
          const event = this.events.find(e => e.id === status.eventId);
          if (event) {
            event.status = status.status;
            if (status.status === 'ACCEPTED') {
              this.userAcceptedRequests.add(event.id);
            } else if (status.status === 'PENDING') {
              this.userPendingRequests.add(event.id);
            } else if (status.status === 'REQUESTED') {
              this.userRequestedToJoin.add(event.id);
            }
          }
        });
        
        // After updating the events status, compare and update localStorage
        this.updateInvitationStateInLocalStorage();
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire('Error', 'Failed to load invitation statuses.', 'error');
        console.error(err);
      }
    });
  }



  sendInvitationToEvent(eventId: number) {
    // Make sure the user hasn't already accepted or requested to join the event
    if (this.userAcceptedRequests.has(eventId)) {
      Swal.fire('Error', 'You have already accepted this event.', 'error');
      return;
    }
  
    if (this.userRequestedToJoin.has(eventId)) {
      Swal.fire('Error', 'You have already requested to join this event.', 'error');
      return;
    }
  
    // If the user has not requested to join the event, proceed with the invitation
    if (this.userId) {
      this.eventService.sendInvitation(eventId, this.userId).subscribe({
        next: () => {
          const event = this.events.find(e => e.id === eventId);
          if (event) {
            event.status = 'REQUESTED';
            this.userRequestedToJoin.add(event.id);  // Add the event to the requested set
          }

          // Save the state to localStorage
          this.updateInvitationStateInLocalStorage();
          Swal.fire('Success', 'Your invitation has been sent to join the event!', 'success');
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire('Error', 'Failed to send invitation to join event.', 'error');
          console.error(err);
        }
      });
    }
  }
  

  acceptInvitation(eventId: number) {
    if (this.isEventAlreadyAccepted(eventId)) {
      Swal.fire('Error', 'You have already accepted this invitation.', 'error');
      return;
    }

    if (this.userId) {
      const invitationId = this.getInvitationIdForEvent(eventId);

      console.log("Invitation ID:", invitationId);  // Debugging

      if (invitationId === null) {
        Swal.fire('Error', 'Invitation not found.', 'error');
        return;
      }

      this.eventService.acceptInvitation(invitationId).subscribe({
        next: () => {
          const event = this.events.find(e => e.id === eventId);
          if (event) {
            event.status = 'ACCEPTED';
            this.userAcceptedRequests.add(event.id);
            this.userPendingRequests.delete(event.id);
          }

          // Save the updated state to localStorage
          this.updateInvitationStateInLocalStorage();
          Swal.fire('Success', 'You have accepted the invitation!', 'success');
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire('Error', 'Failed to accept invitation.', 'error');
          console.error(err);
        }
      });
    }
  }

  getInvitationIdForEvent(eventId: number): number | null {
    // Make sure the invitation has both eventId and userId
    const invitation = this.userInvitations.find(inv => inv.eventId === eventId && inv.userId === this.userId);
    
    // Debugging
    console.log('Searching for invitation for event:', eventId, 'and user:', this.userId);
    console.log('Matching invitation:', invitation);

    return invitation ? invitation.id : null;
  }

  isEventAlreadyAccepted(eventId: number): boolean {
    return this.userAcceptedRequests.has(eventId);
  }

  isEventPending(eventId: number): boolean {
    return this.userPendingRequests.has(eventId);
  }

  isEventRequested(eventId: number): boolean {
    return this.userRequestedToJoin.has(eventId);
  }

  // Save the invitation state to localStorage only if it's different from the previous one
  updateInvitationStateInLocalStorage() {
    const state = {
      acceptedRequests: Array.from(this.userAcceptedRequests),
      pendingRequests: Array.from(this.userPendingRequests),
      requestedToJoin: Array.from(this.userRequestedToJoin),
    };

    // Check if the new state is different from the stored one
    const currentStoredState = localStorage.getItem('invitationState');
    if (currentStoredState) {
      const parsedStoredState = JSON.parse(currentStoredState);
      if (
        JSON.stringify(parsedStoredState) !== JSON.stringify(state) // Compare the state objects
      ) {
        localStorage.setItem('invitationState', JSON.stringify(state));  // Update the stored state
      }
    } else {
      // If no stored state exists, just save the new one
      localStorage.setItem('invitationState', JSON.stringify(state));
    }
  }

  // Load the invitation state from localStorage
  loadInvitationState() {
    const state = localStorage.getItem('invitationState');
    if (state) {
      const parsedState = JSON.parse(state);
      this.userAcceptedRequests = new Set(parsedState.acceptedRequests);
      this.userPendingRequests = new Set(parsedState.pendingRequests);
      this.userRequestedToJoin = new Set(parsedState.requestedToJoin);

      // Reflect the state on the events
      this.events.forEach(event => {
        if (this.userAcceptedRequests.has(event.id)) {
          event.status = 'ACCEPTED';
        } else if (this.userPendingRequests.has(event.id)) {
          event.status = 'PENDING';
        } else if (this.userRequestedToJoin.has(event.id)) {
          event.status = 'REQUESTED';
        }
      });
    }
  }

  // View event details method
  viewEventDetails(eventId: number) {
    // Navigate to the event details page
    this.router.navigate(['/events', eventId]);  // Pass the event ID as a route parameter
  }
}
