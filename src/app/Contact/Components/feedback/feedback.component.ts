import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  feedbackForm: FormGroup;
  selectedRating = 0;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      rating: [0, [Validators.required, Validators.min(1)]],
      feedback: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.feedbackForm.patchValue({ rating: rating });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      console.log('Form submitted:', this.feedbackForm.value);
      this.isSubmitted = true;
      this.feedbackForm.reset();
      this.selectedRating = 0;
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        this.isSubmitted = false;
      }, 5000);
    } else {
      // Mark all fields as touched to show validation messages
      this.feedbackForm.markAllAsTouched();
    }
  }
}