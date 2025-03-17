  import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
  import * as L from 'leaflet';

  interface MarkerLocation {
    lat: number;
    lng: number;
  }

  @Component({
    selector: 'app-map',
    template: `<div id="map-{{uniqueId}}" class="map-container" style="height: 400px;"></div>`,
    styleUrls: ['./map.component.css']
  })
  export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() latitude: number = 43.6047;
    @Input() longitude: number = 1.4442;
    @Input() title: string = 'Emplacement du camping';
    @Output() locationChange = new EventEmitter<MarkerLocation>();
    
    private map: L.Map | null = null;
    private marker: L.Marker | null = null;
    public uniqueId: string = 'map-' + Math.random().toString(36).substring(2, 9);
    private initInterval: any = null;
    private initAttempts: number = 0;
    private maxInitAttempts: number = 10;

    constructor() { }

    ngAfterViewInit(): void {
      // Try to initialize the map with a slight delay
      setTimeout(() => this.forceInitMap(), 100);
      
      // Also set up a fallback interval to keep trying if it fails
      this.initInterval = setInterval(() => {
        if (!this.map && this.initAttempts < this.maxInitAttempts) {
          this.initAttempts++;
          this.forceInitMap();
        } else {
          clearInterval(this.initInterval);
        }
      }, 500);
    }

    ngOnChanges(changes: SimpleChanges): void {
      if ((changes['latitude'] || changes['longitude']) && this.map) {
        // If coordinates change, update map
        this.updateMarkerPosition();
      } else if ((changes['latitude'] || changes['longitude']) && !this.map) {
        // If map isn't created yet but coordinates changed, try creating it
        setTimeout(() => this.forceInitMap(), 100);
      }
    }

    ngOnDestroy(): void {
      if (this.initInterval) {
        clearInterval(this.initInterval);
      }
      
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
    }

    private forceInitMap(): void {
      try {
        const container = document.getElementById(`map-${this.uniqueId}`);
        if (!container) {
          console.warn('Map container not found, will retry');
          return;
        }
        
        if (this.map) {
          console.warn('Map already initialized');
          return;
        }

        // Initialize default icon
        this.initializeDefaultIcon();
        
        // Create map
        this.map = L.map(`map-${this.uniqueId}`, {
          center: [this.latitude, this.longitude],
          zoom: 13
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Add marker
        this.marker = L.marker([this.latitude, this.longitude], {
          draggable: true
        }).addTo(this.map);

        // Add popup
        this.marker.bindPopup(this.title).openPopup();

        // Setup events
        this.setupEvents();
        
        // Signal success
        console.log('Map successfully initialized');
        
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }

    private initializeDefaultIcon(): void {
      const iconRetinaUrl = 'assets/marker-icon-2x.png';
      const iconUrl = 'assets/marker-icon.png';
      const shadowUrl = 'assets/marker-shadow.png';
      const iconDefault = L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      L.Marker.prototype.options.icon = iconDefault;
    }

    private setupEvents(): void {
      if (!this.map || !this.marker) return;
      
      // Handle marker drag events
      this.marker.on('dragend', (event) => {
        const marker = event.target;
        const position = marker.getLatLng();
        this.locationChange.emit({
          lat: position.lat,
          lng: position.lng
        });
        marker.bindPopup(this.title).openPopup();
      });

      // Handle map click events
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        if (!this.marker) return;
        
        const latlng = e.latlng;
        this.marker.setLatLng(latlng);
        this.locationChange.emit({
          lat: latlng.lat,
          lng: latlng.lng
        });
        this.marker.bindPopup(this.title).openPopup();
      });
    }

    private updateMarkerPosition(): void {
      if (!this.map || !this.marker) return;
      
      try {
        // Update marker position
        this.marker.setLatLng([this.latitude, this.longitude]);
        
        // Center map
        this.map.setView([this.latitude, this.longitude], 13);
        
        // Update popup
        this.marker.bindPopup(this.title).openPopup();
      } catch (error) {
        console.error('Error updating marker:', error);
      }
    }

    // Public method to force map refresh
    public refreshMap(): void {
      if (this.map) {
        this.map.invalidateSize();
        this.updateMarkerPosition();
      } else {
        this.forceInitMap();
      }
    }
  }