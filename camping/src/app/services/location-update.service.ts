import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LocationUpdate {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationUpdateService {
  private baseUrl = 'http://localhost:8080/api/locations'; // Update this with your actual API endpoint

  constructor(private http: HttpClient) { }

  updateLocation(locationId: number, location: LocationUpdate): Observable<any> {
    return this.http.put(`${this.baseUrl}/${locationId}`, location);
  }

  createLocation(location: LocationUpdate): Observable<any> {
    return this.http.post(this.baseUrl, location);
  }
} 