import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.component.html',
  styleUrls: ['./confirm-booking.component.css']
})
export class ConfirmBookingComponent implements OnInit {
  currentBooking: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Try to get booking reference from navigation state or localStorage
    const nav = this.router.getCurrentNavigation();
    let bookingRef = nav?.extras?.state?.['reference'];
    if (!bookingRef) {
      // fallback to query param
      const url = new URL(window.location.href);
      bookingRef = url.searchParams.get('reference');
    }
    if (bookingRef) {
      const bookings = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
      this.currentBooking = bookings.find((b: any) => b.reference === bookingRef);
    }
    if (!this.currentBooking) {
      // fallback: show last booking
      const bookings = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
      this.currentBooking = bookings[bookings.length - 1];
    }
  }

  formatDisplayDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  calculateNights(): number {
    if (!this.currentBooking?.checkIn || !this.currentBooking?.checkOut) return 0;
    const checkIn = new Date(this.currentBooking.checkIn);
    const checkOut = new Date(this.currentBooking.checkOut);
    return Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  }

  calculateTotal(): number {
    if (!this.currentBooking?.room?.price) return 0;
    return this.calculateNights() * this.currentBooking.room.price;
  }

  resetBooking() {
    this.router.navigate(['/room-booking']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
