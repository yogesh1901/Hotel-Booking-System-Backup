// customer-feedback.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-feedback',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './customer-feedback.component.html',
  styleUrls: ['./customer-feedback.component.css']
})
export class CustomerFeedbackComponent {
  feedbacks = [
    {
      bookingId: 'B9876',
      date: '12 Mar 2025',
      rating: 5,
      comments: 'Excellent service!',
      response: 'Thank you!'
    }
  ];

  newFeedback = {
    bookingId: '',
    rating: '',
    comments: ''
  };

  submitFeedback() {
    // In a real app, you would send this to your backend
    console.log('Feedback submitted:', this.newFeedback);
    // Reset form
    this.newFeedback = { bookingId: '', rating: '', comments: '' };
  }
}