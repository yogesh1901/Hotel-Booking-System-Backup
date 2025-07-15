import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-page',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './reset-page.component.html',
  styleUrl: './reset-page.component.css'
})
export class ResetPageComponent {
  passwordForm: FormGroup;
  email: string = '';
  otp: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras?.state?.['email'] || '';
    this.otp = navigation?.extras?.state?.['otp'] || '';
    this.passwordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid && this.email) {
      const { otp, newPassword } = this.passwordForm.value;
      if (otp !== this.otp) {
        this.passwordForm.get('otp')?.setErrors({ invalid: true });
        return;
      }
      if (this.authService.resetPassword(this.email, newPassword)) {
        this.router.navigate(['/login'], { queryParams: { passwordReset: 'success' } });
      } else {
        // Optionally handle error
      }
    }
  }
}