import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-testimonials',
  imports:[RouterModule,CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {
  currentTestimonial = 0;
  testimonialInterval: any;
  
  testimonials = [
    {
      backgroundImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      quote: '"The location couldn\'t be better, right in the center of everything. The rooftop bar has stunning views, and our room was spacious and clean. Will definitely stay here again on our next visit!"',
      name: 'Sarah M.',
      title: 'Business Traveler',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      backgroundImage: 'https://i.pinimg.com/736x/55/05/f2/5505f2e12f3cbdebcf8f90354c097636.jpg',
      quote: '"This is the best service I have ever used! The room was perfect, breakfast was amazing. The staff went above and beyond to make our anniversary special. I would highly recommend it!"',
      name: 'John D.',
      title: 'Verified Guest',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      backgroundImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      quote: '"As a frequent business traveler, I appreciate the efficient service and comfortable workspace in the rooms. The executive lounge is a great place to unwind after meetings. Highly recommended for business stays."',
      name: 'Michael T.',
      title: 'Frequent Guest',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    }
  ];

  ngOnInit() {
    this.startTestimonialRotation();
  }

  startTestimonialRotation() {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 7000);
  }

  nextTestimonial() {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
  }

  prevTestimonial() {
    this.currentTestimonial = (this.currentTestimonial - 1 + this.testimonials.length) % this.testimonials.length;
  }

  goToTestimonial(index: number) {
    this.currentTestimonial = index;
    // Reset timer when manually changing testimonials
    clearInterval(this.testimonialInterval);
    this.startTestimonialRotation();
  }
}