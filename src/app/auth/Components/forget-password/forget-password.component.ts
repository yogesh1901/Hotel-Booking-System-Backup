import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgotPasswordComponent {
  resetForm: FormGroup;
  otp: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const email = this.resetForm.value.email;
      if (this.authService.requestPasswordReset(email)) {
        // Generate a 6-digit OTP
        this.otp = Math.floor(100000 + Math.random() * 900000).toString();
        alert('Your OTP is: ' + this.otp);
        // Pass OTP and email to reset page
        this.router.navigate(['/reset-page'], { state: { email, otp: this.otp } });
      } else {
        this.resetForm.get('email')?.setErrors({ notFound: true });
      }
    }
  }
}