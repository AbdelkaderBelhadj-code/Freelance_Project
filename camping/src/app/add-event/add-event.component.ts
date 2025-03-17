import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService, CreateEventRequest } from '../services/EventService.service';
import { LocationUpdateService, LocationUpdate } from '../services/location-update.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {
  eventForm: FormGroup;
  selectedLocation: { lat: number, lng: number } | null = null;
  locationId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private locationUpdateService: LocationUpdateService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  onLocationChange(location: { lat: number, lng: number }): void {
    this.selectedLocation = location;
    
    // First create/update location
    const locationUpdate: LocationUpdate = {
      latitude: location.lat,
      longitude: location.lng
    };

    this.locationUpdateService.createLocation(locationUpdate)
      .subscribe({
        next: (response: any) => {
          console.log('Location created:', response);
          this.locationId = response.id;
        },
        error: (error) => {
          console.error('Error creating location:', error);
        }
      });
  }

  onSubmit(): void {
    if (this.eventForm.valid && this.locationId && this.selectedLocation) {
      const formValue = this.eventForm.value;
      
      const eventRequest: CreateEventRequest = {
        title: formValue.title,
        description: formValue.description,
        date: new Date(formValue.date),
        locationId: this.locationId
      };

      this.eventService.createEvent(eventRequest)
        .subscribe({
          next: (response) => {
            console.log('Event created successfully:', response);
            this.router.navigate(['/events']);
          },
          error: (error) => {
            console.error('Error creating event:', error);
          }
        });
    }
  }
} 