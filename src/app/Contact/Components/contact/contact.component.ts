// contact.component.ts
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  wordCount = 0;
  successMessage = '';

  onMessageInput() {
    const trimmedMessage = this.contactData.message.trim();
    const words = trimmedMessage ? trimmedMessage.split(/\s+/) : [];
    if (words.length > 200) {
      this.contactData.message = words.slice(0, 200).join(' ');
    }
    this.wordCount = this.contactData.message.trim() ?
      this.contactData.message.trim().split(/\s+/).filter(w => w).length : 0;
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.wordCount <= 200) {
      this.successMessage = 'Your message has been sent successfully!';
      form.resetForm();
      this.wordCount = 0;
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }
}