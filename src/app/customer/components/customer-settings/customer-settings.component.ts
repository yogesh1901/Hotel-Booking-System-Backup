// customer-settings.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';


@Component({
  selector: 'app-customer-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-settings.component.html',
  styleUrls: ['./customer-settings.component.css']
})
export class CustomerSettingsComponent {
  passwordForm: FormGroup;
  showOtpSection = false;
  otpSent = false;
  otpVerified = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  requestOtp() {
    if (this.passwordForm.get('currentPassword')?.invalid) {
      this.errorMessage = 'Please enter your current password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    // Simulate OTP sending (in real app, call your API)
    setTimeout(() => {
      this.loading = false;
      this.otpSent = true;
      this.showOtpSection = true;
      this.successMessage = 'OTP sent to your registered email';
    }, 1500);
  }

  verifyOtp() {
    if (this.passwordForm.get('otp')?.invalid) {
      this.errorMessage = 'Please enter a valid 6-digit OTP';
      return;
    }

    // In a real app, verify OTP with your backend
    // For demo, any 6-digit number is considered valid
    this.otpVerified = true;
    this.successMessage = 'OTP verified successfully';
  }

  updatePassword() {
    if (!this.otpVerified || this.passwordForm.invalid) {
      this.errorMessage = 'Please complete all steps';
      return;
    }

    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    // In a real app, verify current password with backend first
    // Then update password in backend
    // For demo, we'll update directly in local storage
    if (this.authService.resetPassword(user.username, newPassword)) {
      this.successMessage = 'Password updated successfully!';
      this.passwordForm.reset();
      this.showOtpSection = false;
      this.otpSent = false;
      this.otpVerified = false;
    } else {
      this.errorMessage = 'Failed to update password';
    }
  }
}