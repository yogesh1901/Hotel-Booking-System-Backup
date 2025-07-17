// login.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    public authService: AuthService,
    private route: ActivatedRoute
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
        const user = this.authService.getCurrentUser();
        // Always use ActivatedRoute for query params
        const queryParams = this.route.snapshot.queryParams;
        const redirect = queryParams['redirect'];
        const intendedRoomNumber = sessionStorage.getItem('intendedRoomNumber');
        if (redirect === 'booking-form' && intendedRoomNumber) {
          // Pass all booking params if available
          const params: any = {
            roomNumber: intendedRoomNumber
          };
          if (queryParams['checkIn']) params.checkIn = queryParams['checkIn'];
          if (queryParams['checkOut']) params.checkOut = queryParams['checkOut'];
          if (queryParams['adults']) params.adults = queryParams['adults'];
          if (queryParams['children']) params.children = queryParams['children'];
          this.router.navigate(['/booking-form'], { queryParams: params });
          sessionStorage.removeItem('intendedRoomNumber');
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