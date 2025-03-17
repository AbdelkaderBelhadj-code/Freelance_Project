import { Component, OnInit } from '@angular/core';
import { EventInvitation, EventService, PendingInvitation } from '../services/EventService.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manageinvitations',
  templateUrl: './manageinvitations.component.html',
  styleUrls: ['./manageinvitations.component.css']
})
export class ManageinvitationsComponent implements OnInit {
  pendingInvitations: PendingInvitation[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadPendingInvitations();
  }

  loadPendingInvitations(): void {
    this.eventService.getAllPendingInvitations().subscribe({
      next: (invitations) => {
        this.pendingInvitations = invitations;
      },
      error: (err) => {
        console.error('Failed to load pending invitations', err);
        Swal.fire('Error', 'Failed to load pending invitations.', 'error');
      },
    });
  }

  acceptInvitation(invitationId: number): void {
    this.eventService.acceptInvitation(invitationId).subscribe({
      next: () => {
        Swal.fire('Success', 'Invitation accepted successfully!', 'success');
        this.loadPendingInvitations(); // Reload invitations after accepting
      },
      error: (err) => {
        console.error('Error accepting invitation', err);
        Swal.fire('Error', 'Failed to accept invitation.', 'error');
      },
    });
  }

  declineInvitation(invitationId: number): void {
    this.eventService.declineInvitation(invitationId).subscribe({
      next: () => {
        Swal.fire('Success', 'Invitation declined successfully!', 'success');
        this.loadPendingInvitations(); // Reload invitations after declining
      },
      error: (err) => {
        console.error('Error declining invitation', err);
        Swal.fire('Error', 'Failed to decline invitation.', 'error');
      },
    });
  }
}
