import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../service/auth.service';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
  };
  status?: string; 
}



export interface CreateEventRequest {
  title: string;
  description: string;
  date: Date;
  locationId: number;
}

export interface EventInvitation {
  id: number;
  eventId: number;
  userId: number;
  status: string;
  eventTitle: string;
  userName: string;
}




@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) { }

  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`);
  }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseUrl);
  }

  createEvent(event: CreateEventRequest): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, event);
  }

  updateEvent(id: number, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getEventById(eventId: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${eventId}`);
  }

  requestToJoinEvent(eventId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${eventId}/invite/${userId}`, {});
  }

  getAcceptedUsers(eventId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/${eventId}/accepted-users`);
  }


  getAcceptedInvitations(userId: number): Observable<EventInvitation[]> {
    return this.http.get<EventInvitation[]>(`${this.baseUrl}/user/${userId}/accepted-invitations`);
  }

  getUserEventsStatus(userId: number): Observable<EventStatus[]> {
    return this.http.get<EventStatus[]>(`${this.baseUrl}/user/${userId}/events-status`);
  }

  
  sendInvitation(eventId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${eventId}/invite/${userId}`, {});
  }
  
  getAcceptedUsersForEvent(eventId: number): Observable<string[]> {
  return this.http.get<string[]>(`${this.baseUrl}/${eventId}/accepted-users`);
}

getPendingInvitations(): Observable<EventInvitation[]> {
  return this.http.get<EventInvitation[]>(`${this.baseUrl}/invitations/pending`);
}

// Method to accept an invitation
acceptInvitation(invitationId: number): Observable<void> {
  return this.http.post<void>(`${this.baseUrl}/invitation/${invitationId}/accept`, {});
}

// Method to decline an invitation
declineInvitation(invitationId: number): Observable<void> {
  return this.http.post<void>(`${this.baseUrl}/invitation/${invitationId}/decline`, {});
}

getAllPendingInvitations(): Observable<PendingInvitation[]> {
  return this.http.get<PendingInvitation[]>(`${this.baseUrl}/all-pending-invitations`);
}

deleteUserFromEvent(eventId: number, userId: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${eventId}/remove-user/${userId}`);
}

getUserIdFromUsername(username: string): Observable<number> {
  return this.http.get<number>(`http://localhost:8080/api/auth/getUserIdByUsername/${username}`);
}



}
export interface EventStatus {
  eventId: number;
  status: string;  // e.g., "PENDING", "ACCEPTED", "DECLINED"
}

export interface PendingInvitation {
  invitationId: number;
  eventTitle: string;
  userName: string;
  status: string;
}
