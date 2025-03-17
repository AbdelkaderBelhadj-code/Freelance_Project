import { Component, OnInit, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../services/EventService.service';
import { LocationService } from '../services/LocationService.service';
import { map } from 'rxjs/operators';
import * as L from 'leaflet';

export interface CampingLocation {
  id: number;
  name: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
}

export interface EventWithLocation {
  id: number;
  title: string;
  description: string;
  date: Date;
  locationId?: number;
  location?: CampingLocation | null;
}

@Component({
  selector: 'app-eventdetail',
  templateUrl: './eventdetail.component.html',
  styleUrls: ['./eventdetail.component.css']
})
export class EventdetailComponent implements OnInit, AfterViewInit, OnDestroy {
  event: any = null;
  isLoading = true;
  errorMessage = '';
  private map: any;
  private marker: any;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEventDetails(+eventId);
    } else {
      this.errorMessage = 'Event ID not found';
      this.isLoading = false;
    }
  }

  loadEventDetails(eventId: number): void {
    this.isLoading = true;
    this.eventService.getEvent(eventId).subscribe({
      next: (eventData) => {
        this.event = eventData;
        this.isLoading = false;
        this.ngZone.runOutsideAngular(() => this.initMap());
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.errorMessage = 'Failed to load event details';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.event && this.event.location) {
      this.initMap();
    }
  }

  private initMap(): void {
    if (this.event && this.event.location) {
      if (this.map) {
        this.map.remove();
      }
      this.map = L.map('event-location-map').setView([
        this.event.location.latitude,
        this.event.location.longitude
      ], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      const customIcon = L.icon({
        iconUrl: 'assets/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });

      this.marker = L.marker([
        this.event.location.latitude,
        this.event.location.longitude
      ], { icon: customIcon }).addTo(this.map)
        .bindPopup(this.event.location.name || 'Event Location')
        .openPopup();
    }
  }

  forceMapRefresh(): void {
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
