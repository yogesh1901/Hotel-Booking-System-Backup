import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;
  signupError: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s'-]+$/)
      ]],
      username: ['', [
        Validators.required,
        Validators.pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      return null;
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  getPasswordStrength() {
    const password = this.signupForm.get('password')?.value;
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    return Math.min(Math.floor(strength / 2), 3); // Return 0-3
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isSubmitting = true;
      this.signupError = null;
      const formData = this.signupForm.value;
      // Prepare full customer object with all required fields
      const customersStr = localStorage.getItem('hotel_customers');
      let customers: any[] = customersStr ? JSON.parse(customersStr) : [];
      // Generate next customerId (sequential, unique)
      let nextId = 1;
      if (customers.length > 0) {
        const maxId = Math.max(...customers.map(c => parseInt(c.customerId, 10) || 0));
        nextId = maxId + 1;
      }
      // Check for duplicate email
      if (customers.some(c => c.email === formData.username)) {
        this.signupError = 'This email is already registered';
        this.isSubmitting = false;
        return;
      }
      const newCustomer = {
        id: Date.now().toString(), // ensure unique id
        customerId: nextId.toString(),
        name: formData.fullName,
        aadhar: formData.aadharNo,
        email: formData.username,
        phone: '',
        address: '',
        country: '',
        password: formData.password,
        photo: '',
        totalBooking: 0,
        status: 'Unblock'
      };
      customers.push(newCustomer);
      localStorage.setItem('hotel_customers', JSON.stringify(customers));
      this.signupError = null;
      alert('Account created successfully! Please log in.');
      this.router.navigate(['/login']);
      this.isSubmitting = false;
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}