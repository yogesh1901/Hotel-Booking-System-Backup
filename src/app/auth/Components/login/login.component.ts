// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPassword = false;
  loginForm: FormGroup;
  loginError = '';
  rememberMe = false;
  currentRole: string = '';

  constructor(
    private fb: FormBuilder, 
    public router: Router,
    public authService: AuthService
  ) {
    

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$|^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });

    // Disable password field initially
    this.loginForm.get('password')?.disable();

    // Enable/disable password field based on username validity
    this.loginForm.get('username')?.statusChanges.subscribe(status => {
      const passwordControl = this.loginForm.get('password');
      if (status === 'VALID') {
        passwordControl?.enable();
      } else {
        passwordControl?.disable();
        passwordControl?.reset();
      }
    });

    // Set currentRole if authenticated
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      this.currentRole = user?.role || '';
    }
  }

  togglePassword() {
    if (this.loginForm.get('username')?.valid) {
      this.showPassword = !this.showPassword;
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password, remember } = this.loginForm.value;
      this.rememberMe = remember;
      this.loginError = '';
      if (this.authService.login(username, password)) {
        // Always redirect to home page after login as user
        const user = this.authService.getCurrentUser();
        // Check for redirect after login (e.g., from Book Now)
        const redirect = this.router.getCurrentNavigation()?.extras?.queryParams?.['redirect'];
        const intendedRoomId = sessionStorage.getItem('intendedRoomId');
        if (redirect === 'room-booking' && intendedRoomId) {
          // Go to room booking page and auto-select the room
          this.router.navigate(['/room-booking'], { queryParams: { roomId: intendedRoomId } });
          sessionStorage.removeItem('intendedRoomId');
        } else if (user?.role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.loginError = 'Invalid credentials. Please try again.';
      }
    }
  }
}