import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Location {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private baseUrl = 'http://localhost:8080/api/locations';

  constructor(private http: HttpClient) { }

  getLocation(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.baseUrl}/${id}`);
  }

  getAllLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.baseUrl);
  }

  createLocation(location: Location): Observable<Location> {
    return this.http.post<Location>(this.baseUrl, location);
  }

  updateLocation(id: number, location: Location): Observable<Location> {
    return this.http.put<Location>(`${this.baseUrl}/${id}`, location);
  }

  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}