import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public signUpForm!: FormGroup;
  selectedFile: File | null = null;
  type: string = 'password';
  eyeIcon: string = 'fa fa-eye-slash';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  hideShowPass() {
    this.type = this.type === 'password' ? 'text' : 'password';
    this.eyeIcon = this.type === 'password' ? 'fa fa-eye-slash' : 'fa fa-eye';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const userData = {
        username: this.signUpForm.get('username')?.value,
        email: this.signUpForm.get('email')?.value,
        password: this.signUpForm.get('password')?.value
      };
  
      this.auth.signUp(userData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Account Created',
            text: 'Your account has been successfully created!',
            confirmButtonText: 'OK'
          }).then(() => {
            this.signUpForm.reset();
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: err?.error?.message || 'Something went wrong. Please try again.',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Form Incomplete',
        text: 'Please fill in all required fields correctly.',
        confirmButtonText: 'OK'
      });
    }
  }
  
}
