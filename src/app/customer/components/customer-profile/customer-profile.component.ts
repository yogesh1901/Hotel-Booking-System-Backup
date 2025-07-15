import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent {
  isEditing = false;
  showConfirmationModal = false;
  modalConfig = {
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {}
  };
  originalProfileData: any = {};
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = 'https://randomuser.me/api/portraits/men/22.jpg';
  
  formErrors = {
    phone: '',
    email: '',
    address: '',
    country: '',
    aadhar: ''
  };

  profileData = {
    name: '',
    aadhar: '', // treat as string
    email: '',
    phone: '',
    address: '',
    country: '',
    password: '',
    photo: null
  };

  constructor() {
    this.loadProfileData();
  }

  loadProfileData() {
    const userStr = sessionStorage.getItem('currentUser') || localStorage.getItem('rememberUser');
    let userEmailOrPhone = '';
    if (userStr) {
      const user = JSON.parse(userStr);
      userEmailOrPhone = user.email || user.phone || user.username;
    }
    const customersStr = localStorage.getItem('hotel_customers');
    if (customersStr && userEmailOrPhone) {
      const customers = JSON.parse(customersStr);
      const found = customers.find((c: any) =>
        (c.email && c.email === userEmailOrPhone) ||
        (c.phone && c.phone === userEmailOrPhone) ||
        (c.username && c.username === userEmailOrPhone)
      );
      if (found) {
        this.profileData = {
          name: found.name || '',
          aadhar: found.aadhar ? String(found.aadhar) : '',
          email: found.email || '',
          phone: found.phone || '',
          address: found.address || '',
          country: found.country || '',
          password: found.password || '',
          photo: found.photo || null
        };
        if (found.photo) {
          this.previewUrl = found.photo;
        }
      }
    }
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    
    if (this.isEditing) {
      this.originalProfileData = {...this.profileData};
      this.clearValidationErrors();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.match('image.*')) {
        this.showNotification('Please select an image file', 'error');
        return;
      }
      
      if (file.size > 2097152) {
        this.showNotification('Image should be less than 2MB', 'error');
        return;
      }

      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result ?? null;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  validateField(field: string, value: string) {
    switch (field) {
      case 'phone':
        if (!value) {
          this.formErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10,15}$/.test(value)) {
          this.formErrors.phone = 'Please enter a valid phone number (10-15 digits)';
        } else {
          this.formErrors.phone = '';
        }
        break;
        
      case 'email':
        if (!value) {
          this.formErrors.email = 'Email is required';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          this.formErrors.email = 'Please enter a valid email address';
        } else {
          this.formErrors.email = '';
        }
        break;
        
      case 'address':
        if (!value) {
          this.formErrors.address = 'Address is required';
        } else if (value.length < 10) {
          this.formErrors.address = 'Address should be at least 10 characters';
        } else {
          this.formErrors.address = '';
        }
        break;
        
      case 'country':
        if (!value) {
          this.formErrors.country = 'Country is required';
        } else if (!/^[a-zA-Z\s]{2,}$/.test(value)) {
          this.formErrors.country = 'Country should contain only letters and be at least 2 characters';
        } else {
          this.formErrors.country = '';
        }
        break;

      case 'aadhar':
        if (value && !/^[0-9]{12}$/.test(value)) {
          this.formErrors.aadhar = 'Aadhaar must be exactly 12 digits';
        } else {
          this.formErrors.aadhar = '';
        }
        break;
    }
  }

  validateForm(): boolean {
    this.validateField('phone', this.profileData.phone);
    this.validateField('email', this.profileData.email);
    this.validateField('address', this.profileData.address);
    this.validateField('country', this.profileData.country);
    this.validateField('aadhar', this.profileData.aadhar);
    return !Object.values(this.formErrors).some(error => error !== '');
  }

  clearValidationErrors() {
    this.formErrors = {
      phone: '',
      email: '',
      address: '',
      country: '',
      aadhar: ''
    };
  }

  confirmSave() {
    if (!this.validateForm()) {
      this.showNotification('Please correct the errors in the form', 'error');
      return;
    }

    this.showConfirmationDialog(
      'Confirm Changes',
      'Are you sure you want to save these changes?',
      () => this.saveProfile()
    );
  }

  saveProfile() {
    // Aadhaar validation
    if (this.profileData.aadhar && !/^[0-9]{12}$/.test(this.profileData.aadhar)) {
      this.showNotification('Aadhaar must be exactly 12 digits', 'error');
      return;
    }

    // Save updated profile to localStorage
    const customersStr = localStorage.getItem('hotel_customers');
    if (customersStr) {
      const customers = JSON.parse(customersStr);
      // Use original email/phone for lookup to allow email/phone change
      const origEmail = this.originalProfileData.email;
      const origPhone = this.originalProfileData.phone;
      const idx = customers.findIndex((c: any) =>
        (c.email && c.email === origEmail) ||
        (c.phone && c.phone === origPhone)
      );

      if (idx !== -1) {
        const updated = { ...customers[idx] };
        // Update all editable fields
        updated.name = this.profileData.name;
        updated.phone = this.profileData.phone;
        updated.email = this.profileData.email;
        updated.address = this.profileData.address;
        updated.country = this.profileData.country;
        // Aadhaar always editable now
        updated.aadhar = this.profileData.aadhar;
        if (this.selectedFile && this.previewUrl) {
          updated.photo = this.previewUrl;
        }
        customers[idx] = updated;
        localStorage.setItem('hotel_customers', JSON.stringify(customers));
        // Update session/local storage if needed
        const userStr = sessionStorage.getItem('currentUser') || localStorage.getItem('rememberUser');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.email = this.profileData.email;
          user.phone = this.profileData.phone;
          // Aadhaar always editable now
          user.aadhar = this.profileData.aadhar;
          user.name = this.profileData.name;
          user.address = this.profileData.address;
          user.country = this.profileData.country;
          user.photo = this.previewUrl;
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          if (localStorage.getItem('rememberUser')) {
            localStorage.setItem('rememberUser', JSON.stringify(user));
          }
        }
        this.showNotification('Profile updated successfully', 'success');
        this.isEditing = false;
      }
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.profileData = { ...this.originalProfileData };
    this.selectedFile = null;
    if (this.originalProfileData.photo) {
      this.previewUrl = this.originalProfileData.photo;
    }
    this.clearValidationErrors();
  }

  // Add missing showNotification and showConfirmationDialog methods
  showNotification(message: string, type: string) {
    alert(`${type.toUpperCase()}: ${message}`);
  }

  showConfirmationDialog(title: string, message: string, onConfirm: () => void) {
    this.modalConfig = {
      title,
      message,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm
    };
    this.showConfirmationModal = true;
  }

  onModalCancel() {
    this.showConfirmationModal = false;
  }

  onModalConfirm() {
    if (this.modalConfig.onConfirm) {
      this.modalConfig.onConfirm();
    }
    this.showConfirmationModal = false;
  }
}