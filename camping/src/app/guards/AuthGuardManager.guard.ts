import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardManager implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = this.authService.getCurrentUser(); // Get user details from token

    if (user && user.roles.includes('Organisateur')) {
      return true; // Allow access to organizers
    } else {
      this.router.navigate(['/unauthorized']); // Redirect unauthorized users
      return false;
    }
  }
}
