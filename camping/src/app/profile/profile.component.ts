import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  updatedUserData: Partial<User> = {};

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // Load the current user profile from the AuthService
  loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
      this.updatedUserData.username = currentUser.username;
      this.updatedUserData.email = currentUser.email;
    } else {
      this.router.navigate(['/login']); // If not logged in, redirect to login
    }
  }

  // Update user profile
  updateUserProfile(): void {
    if (this.user) {
      this.authService.updateUserProfile(this.updatedUserData).subscribe(
        (updatedUser) => {
          console.log('User profile updated successfully:', updatedUser);
          this.loadUserProfile(); // Reload the updated profile
        },
        (error) => {
          console.error('Error updating profile:', error);
        }
      );
    }
  }
}
