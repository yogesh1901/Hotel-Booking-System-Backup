import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports:[RouterModule,CommonModule],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent {
  offers = [
    {
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      title: 'GET 25% OFF',
      subtitle: 'FIRST TIME BOOKING!',
      description: 'Valid for new customers only. Book your first stay and enjoy 25% discount on all room types.'
    },
    {
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      title: 'STAY 3+ NIGHTS',
      subtitle: '@GET BREAKFAST FREE EACH MORNING',
      description: 'Extended stay offer includes complimentary breakfast for all guests in the room.'
    },
    {
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      title: 'UP TO 60% OFF',
      subtitle: 'BUDGET STAYS!',
      description: 'Special rates for budget-conscious travelers. Limited rooms available at this price.'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(url: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${url}')`);
  }
}