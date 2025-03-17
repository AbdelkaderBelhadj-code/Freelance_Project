import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public resetForm!: FormGroup;

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  public restPasswordEmail!: string;
  public isValidEmail!: Boolean;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,

  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });


  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Response:', res);
  
          // Ensure the response contains a valid token
          if (res && res.accessToken) {
            this.auth.storeToken(res.accessToken);  // Store the correct token
  
            // Debugging: Verify the stored token
            console.log('Stored Token:', this.auth.getToken());
  
            // Decode token after storage
            setTimeout(() => {
              const tokenPayload = this.auth.decodedToken();
              console.log('Decoded Token:', tokenPayload);
  
              if (tokenPayload) {
                this.loginForm.reset();
                this.router.navigate(['/events']);
                Swal.fire({
                  icon: 'success',
                  title: 'Login Successful',
                  text: 'You have successfully logged in.',
                  timer: 5000
                }).then(() => {
                  window.location.reload();
                });
              }
            }, 100);
          } else {
            console.error('Token not received from server.');
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          let errorMessage = 'An error occurred during login.';
          if (err.status === 400 && err.error.message === 'Bad credentials') {
            errorMessage = 'Invalid username or password.';
          } else if (err.status === 404) {
            errorMessage = 'User not found.';
          }
          Swal.fire({
            icon: 'error',
            title: 'Login Error',
            text: errorMessage,
            timer: 5000
          });
        }
      });
    }
  }
  
  
  
  
  
  

  
  


  checkValueEmail(event: string){
    const value = event;
    const pattern = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend() {
    if (this.resetForm.valid) {
      this.auth.requestPasswordReset(this.resetForm.value.email).subscribe({
        next: () => {
          Swal.fire('Success', 'Reset link sent to your email.', 'success');
        },
        error: () => {
          Swal.fire('Error', 'Email not found.', 'error');
        },
      });
    } else {
      Swal.fire('Error', 'Please enter a valid email.', 'error');
    }
  }



}
