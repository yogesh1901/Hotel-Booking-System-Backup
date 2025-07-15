import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-adminprofile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adminprofile.component.html',
  styleUrls: ['./adminprofile.component.css']
})
export class AdminprofileComponent {
  admin = {
    name: 'Yogeshwaran R',
    email: 'admin@gmail.com',
    phone: '+91 9677440158',
    address: '14a Thanjavur Road, Thanjavur, Tamil Nadu, India',
    position: 'System Administrator',
    department: 'IT',
    bio: 'Responsible for managing the hotel management system',
    profileImage: 'https://randomuser.me/api/portraits/men/22.jpg'
  };

  isEditing = false;
  editedAdmin = { ...this.admin };

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editedAdmin = { ...this.admin };
    }
  }

  saveChanges() {
    this.admin = { ...this.editedAdmin };
    this.isEditing = false;
    // Here you would typically call a service to update the admin details in the backend
  }

  cancelEdit() {
    this.isEditing = false;
  }

  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editedAdmin.profileImage = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}