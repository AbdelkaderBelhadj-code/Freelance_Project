import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  isOrganisateur: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check if the user is authenticated when the component loads
    this.isAuthenticated = this.authService.isLoggedIn();

    // If authenticated, check if the user has 'Organisateur' role
    if (this.isAuthenticated) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && currentUser.roles.includes('Organisateur')) {
        this.isOrganisateur = true;
      }
    }
  }

  logout(): void {
    this.authService.signOut();  // This should handle the logout process
    this.router.navigate(['/login']);  // Redirect to login page after logout
  }
}