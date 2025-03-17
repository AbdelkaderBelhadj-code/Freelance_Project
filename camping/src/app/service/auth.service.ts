import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt'
import { map, Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = 'http://localhost:8080/api/auth';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  /** Store JWT Token **/
  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  /** Decode JWT Token **/
  public decodedToken() {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }

  /** Get current user details from token **/
  getCurrentUser(): User | null {
    const decoded = this.decodedToken();
    if (decoded) {
      return {
        id: decoded.id || decoded.userId,
        username: decoded.sub,
        email: decoded.email,
        roles: decoded.roles || [],
      };
    }
    return null;
  }

  getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id.toString() : null;
  }

  signUp(userData: any) {
    return this.http.post(`${this.baseUrl}/signup`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  signIn(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signin`, loginData).pipe(
      map(res => {
        console.log('API Response:', res);
        if (res && res.token) { // Ensure correct key
          this.storeToken(res.token);
        }
        return res;
      })
    );
  }
  

  signOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/${userId}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }


  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/user/${userId}`);
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset`, { email });
  }

  submitNewPassword(payload: { token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/new-password`, payload);
  }

  
  updateUser(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/update?userId=${userId}`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    const userId = this.getCurrentUserId(); // Retrieve user ID from decoded token
    if (!userId) {
      throw new Error('User is not logged in.');
    }
    return this.updateUser(parseInt(userId), userData); // Use the user ID to update the profile
  }
}