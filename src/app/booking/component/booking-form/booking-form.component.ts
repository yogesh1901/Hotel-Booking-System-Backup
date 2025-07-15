import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface Room {
  roomNumber: string;
  type: string;
  capacity: number;
  price: number;
  status: string;
  image: string;
  amenities: string[];
  // Add these for template compatibility
  name?: string;
  description?: string;
  size?: string;
}

interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  aadhar?: string;
  requests: string;
}

interface CreditCardInfo {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

interface PayPalInfo {
  email: string;
}

interface BankTransferInfo {
  accountNumber: string;
  accountName: string;
  ifsc: string;
}

interface UPIInfo {
  id: string;
}

interface PaymentInfo {
  method: string;
  creditCard: CreditCardInfo;
  paypal: PayPalInfo;
  bankTransfer: BankTransferInfo;
  upi: UPIInfo;
}

interface Booking {
  BookingId?: string; // Optional for new bookings
  room: Room;
  bookingType: 'self' | 'other';
  checkIn: string;
  checkOut: string;
  bookingEmail: string;
  guestInfo: GuestInfo;
  paymentInfo: PaymentInfo;
  reference: string;
  termsAgreed: boolean;
  adults: number;
  children: number;
  rooms: number;
  cancelBooking: boolean;
  cancelCharges?: number; // Optional, only if cancelBooking is true
  status: 'confirmed' | 'cancelled' | 'completed';
  modificationCount: number;
  adminMessage?: string;
  refundAmount?: number;
  refundcharge?: number;
  modificationFee?: number;
  upgradeAmount?: number;
  modificationDate?: string; // Date of last modification
  createdAt?: string; // Date of booking creation

}

@Component({
  selector: 'app-booking-form',
  standalone: true,
imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent {
  showTermsModal = false;
  showPrivacyModal = false;
  @Input() currentBooking!: Booking;
  @Output() bookingConfirmed = new EventEmitter<void>();
  @Output() backToRooms = new EventEmitter<void>();

  paymentMethods = [
    { value: 'credit', label: 'Credit/Debit Card', icon: 'credit_card' },
    { value: 'paypal', label: 'PayPal', icon: 'payments' },
    { value: 'bank', label: 'Bank Transfer', icon: 'account_balance' },
    { value: 'upi', label: 'UPI Payment', icon: 'qr_code' }
  ];

  bookingFor: 'self' | 'other' = 'self';
  formErrors: string[] = [];
  public Math = Math;
  profileIncomplete: boolean = false;
  profileIncompleteFields: string[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    // On init, load roomNumber from query params and set up booking object if needed
    this.route.queryParams.subscribe(params => {
      const roomNumber = params['roomNumber'];
      if (roomNumber) {
        const roomsStr = localStorage.getItem('hotel_rooms');
        if (roomsStr) {
          const rooms = JSON.parse(roomsStr);
          const room = rooms.find((r: any) => r.roomNumber == roomNumber);
          if (room) {
            if (!this.currentBooking) {
              this.currentBooking = {
                room,
                bookingEmail: '',
                bookingType: 'self', // Default to self booking
                checkIn: params['checkIn'] || '',
                checkOut: params['checkOut'] || '',
                guestInfo: { name: '', email: '', phone: '', aadhar: '', requests: '' },
                paymentInfo: {
                  method: 'credit',
                  creditCard: { number: '', expiry: '', cvv: '', name: '' },
                  paypal: { email: '' },
                  bankTransfer: { accountNumber: '', accountName: '', ifsc: '' },
                  upi: { id: '' }
                },
                reference: '',
                termsAgreed: false,
                adults: params['adults'] ? +params['adults'] : 1,
                children: params['children'] ? +params['children'] : 0,
                rooms: 1,
                refundAmount: 0,
                refundcharge: 0,
                cancelBooking: false,
                cancelCharges: 0, // Set cancelCharges to 0 for new booking
                status: 'confirmed', // Set default status
                modificationCount: 0, // Initialize modification count
                modificationFee: 0,
              };
            } else {
              this.currentBooking.room = room;
              if (params['checkIn']) this.currentBooking.checkIn = params['checkIn'];
              if (params['checkOut']) this.currentBooking.checkOut = params['checkOut'];
              if (params['adults']) this.currentBooking.adults = +params['adults'];
              if (params['children']) this.currentBooking.children = +params['children'];
            }
          }
        }
      }
      // Prefill guest info for self
      if (this.bookingFor === 'self') {
        this.prefillSelfGuestInfo();
      }
    });
  }

  prefillSelfGuestInfo() {
    // Get the username (which is the email) of the current logged-in user from sessionStorage
    const sessionUserStr = sessionStorage.getItem('currentUser');
    let user: any = null;
    let username: string | undefined = undefined;
    this.profileIncomplete = false;
    this.profileIncompleteFields = [];
    if (sessionUserStr) {
      const sessionUser = JSON.parse(sessionUserStr);
      username = sessionUser.username; // username is actually the email
    }
    if (username) {
      // Find the user in hotel_customers by email (username)
      const hotelCustomersStr = localStorage.getItem('hotel_customers');
      if (hotelCustomersStr) {
        const hotelCustomers = JSON.parse(hotelCustomersStr);
        user = hotelCustomers.find((u: any) => u.email === username);
      }
    }
    if (user) {
      this.currentBooking.guestInfo = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        aadhar: user.aadhar || '',
        requests: this.currentBooking.guestInfo?.requests || ''
      };
      // Check for missing required fields
      const requiredFields = [
        { key: 'name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'aadhar', label: 'Aadhaar Number' }
      ];
      this.profileIncompleteFields = requiredFields
        .filter(f => !user[f.key] || user[f.key].toString().trim() === '')
        .map(f => f.label);
      if (this.profileIncompleteFields.length > 0) {
        this.profileIncomplete = true;
      }
    } else {
      // If user is not found in hotel_customers, clear guest info
      this.currentBooking.guestInfo = { name: '', email: '', phone: '', aadhar: '', requests: '' };
      this.profileIncomplete = true;
      this.profileIncompleteFields = ['Full Name', 'Email', 'Phone Number', 'Aadhaar Number'];
    }
  }

  goToProfile() {
    this.router.navigate(['/customer/profile']); // Adjust route as needed
  }

  onBookingForChange() {
    if (this.bookingFor === 'self') {
      this.prefillSelfGuestInfo();
    } else {
      this.currentBooking.guestInfo = { name: '', email: '', phone: '', aadhar: '', requests: '' };
    }
  }

  calculateNights(): number {
    const checkInDate = new Date(this.currentBooking.checkIn);
    const checkOutDate = new Date(this.currentBooking.checkOut);
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  calculateTotal(): number {
    const nights = this.calculateNights();
    if (!this.currentBooking.room) return 0;
    let basePrice = this.currentBooking.room.price * nights;
    let extraGuestCharge = 0;
    const totalGuests = this.currentBooking.adults + this.currentBooking.children;
    if (totalGuests > 2) {
      extraGuestCharge = this.currentBooking.room.price * 0.2 * (totalGuests - 2) * nights;
    }
    return Math.round((basePrice + extraGuestCharge) * 1.18); // 18% tax
  }

  formatDisplayDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  public goToHome() {
    this.router.navigate(['/']);
  }
  confirmBooking() {
    this.formErrors = [];
    // Set bookingType and bookingEmail before validation
    this.currentBooking.bookingType = this.bookingFor;
    // Get current logged-in user email from sessionStorage
    const sessionUserStr = sessionStorage.getItem('currentUser');
    let bookingEmail = '';
    if (sessionUserStr) {
      const sessionUser = JSON.parse(sessionUserStr);
      bookingEmail = sessionUser.username || '';
    }
    this.currentBooking.bookingEmail = bookingEmail;
    // Add validation logic here
    if (!this.currentBooking.guestInfo.name?.trim()) {
      this.formErrors.push('Full Name is required.');
    }
    if (!this.currentBooking.guestInfo.email?.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.currentBooking.guestInfo.email)) {
      this.formErrors.push('A valid Email Address is required.');
    }
    if (!this.currentBooking.guestInfo.phone?.trim() || !/^\d{10,15}$/.test(this.currentBooking.guestInfo.phone)) {
      this.formErrors.push('A valid Phone Number is required (10-15 digits).');
    }
    if (this.bookingFor === 'other' && (!this.currentBooking.guestInfo.aadhar?.trim() || !/^\d{12}$/.test(this.currentBooking.guestInfo.aadhar))) {
      this.formErrors.push('Aadhaar Number is required (12 digits).');
    }
    // Payment validation for all methods
    const payment = this.currentBooking.paymentInfo;
    switch (payment.method) {
      case 'credit':
        if (!payment.creditCard?.number || !/^\d{16}$/.test(payment.creditCard.number.replace(/\s/g, ''))) {
          this.formErrors.push('Credit Card Number must be 16 digits.');
        }
        if (!payment.creditCard?.expiry || !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(payment.creditCard.expiry)) {
          this.formErrors.push('Expiry Date must be in MM/YY format.');
        }
        if (!payment.creditCard?.cvv || !/^\d{3,4}$/.test(payment.creditCard.cvv)) {
          this.formErrors.push('CVV must be 3 or 4 digits.');
        }
        if (!payment.creditCard?.name?.trim()) {
          this.formErrors.push('Name on Card is required.');
        }
        break;
      case 'paypal':
        if (!payment.paypal?.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payment.paypal.email)) {
          this.formErrors.push('A valid PayPal Email is required.');
        }
        break;
      case 'bank':
        if (!payment.bankTransfer?.accountNumber || !/^\d{9,18}$/.test(payment.bankTransfer.accountNumber)) {
          this.formErrors.push('Account Number must be 9-18 digits.');
        }
        if (!payment.bankTransfer?.accountName?.trim()) {
          this.formErrors.push('Account Name is required.');
        }
        if (!payment.bankTransfer?.ifsc || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(payment.bankTransfer.ifsc)) {
          this.formErrors.push('A valid IFSC Code is required (e.g., ABCD0123456).');
        }
        break;
      case 'upi':
        if (!payment.upi?.id || !/^\w+@[\w]+$/.test(payment.upi.id)) {
          this.formErrors.push('A valid UPI ID is required (e.g., yourname@upi).');
        }
        break;
    }
    if (!this.currentBooking.termsAgreed) {
      this.formErrors.push('Please agree to the terms and conditions.');
    }
    if (this.formErrors.length === 0) {
      // Generate a reference number
      this.currentBooking.reference = 'BK' + Math.floor(100000 + Math.random() * 900000).toString();
      // Calculate next BookingId
      const bookingsStr = localStorage.getItem('hotel_bookings');
      let bookings: Booking[] = bookingsStr ? JSON.parse(bookingsStr) : [];
      const nextId = bookings.length > 0
        ? Math.max(...bookings.map(b => Number(b.BookingId) || 0)) + 1
        : 1;
      // Always set cancelBooking to false for new booking
      this.currentBooking.BookingId = nextId.toString();
      this.currentBooking.cancelBooking = false;
      this.currentBooking.status = 'confirmed';
      this.currentBooking.modificationCount = 0;
      this.currentBooking.adminMessage = '';
      this.currentBooking.refundAmount = 0;
      this.currentBooking.modificationFee = 0;
      this.currentBooking.upgradeAmount = 0;
      // Store booking in localStorage
      bookings.push({ ...this.currentBooking });
      localStorage.setItem('hotel_bookings', JSON.stringify(bookings));
      // Update room status to Occupied
      const roomsStr = localStorage.getItem('hotel_rooms');
      if (roomsStr) {
        const rooms = JSON.parse(roomsStr);
        const idx = rooms.findIndex((r: any) => r.roomNumber == this.currentBooking.room.roomNumber);
        if (idx !== -1) {
          rooms[idx].status = 'Occupied';
          localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
        }
      }
      // Increment totalBooking for the customer
      const customersStr = localStorage.getItem('hotel_customers');
      if (customersStr && this.currentBooking.bookingEmail) {
        const customers = JSON.parse(customersStr);
        const customerIdx = customers.findIndex((c: any) => c.email === this.currentBooking.bookingEmail);
        if (customerIdx !== -1) {
          customers[customerIdx].totalBooking = (customers[customerIdx].totalBooking || 0) + 1;
          localStorage.setItem('hotel_customers', JSON.stringify(customers));
        }
      }
      // Redirect to confirmation page with booking reference
      this.router.navigate(['/confirm-booking'], { state: { reference: this.currentBooking.reference } });
    }
  }

  goBack() {
    this.backToRooms.emit();
  }

  /**
   * Returns true if the booking can be modified by the customer.
   * - Only allow one modification (modificationCount < 1)
   * - Cannot modify if check-in is today or in the past
   * - Cannot modify if status is 'cancelled' or 'completed'
   */
  canModifyBooking(): boolean {
    if (!this.currentBooking) return false;
    const today = new Date();
    const checkIn = new Date(this.currentBooking.checkIn);
    // Remove time part for comparison
    today.setHours(0,0,0,0);
    checkIn.setHours(0,0,0,0);
    return (
      this.currentBooking.modificationCount < 1 &&
      this.currentBooking.status === 'confirmed' &&
      checkIn > today &&
      !this.currentBooking.cancelBooking
    );
  }

  /**
   * Handles booking modification by the customer.
   * - Updates booking fields and localStorage
   * - Calculates modification fee/upgrade if needed
   * - Sets status to 'modified' and increments modificationCount
   * - Shows UI feedback
   */
  modifyBooking(newBookingData: Partial<Booking>) {
    this.formErrors = [];
    if (!this.canModifyBooking()) {
      this.formErrors.push('Booking cannot be modified. Modification is allowed only once and before check-in date.');
      return;
    }
    // Calculate modification fee (example: flat 10% of total if dates/room type change)
    let modificationFee = 0;
    let upgradeAmount = 0;
    let refundAmount = 0;
    const oldTotal = this.calculateTotal();
    // Apply new data to booking (simulate modification)
    const prevRoom = this.currentBooking.room;
    const prevCheckIn = this.currentBooking.checkIn;
    const prevCheckOut = this.currentBooking.checkOut;
    Object.assign(this.currentBooking, newBookingData);
    // Recalculate total after modification
    const newTotal = this.calculateTotal();
    // Example business rule: charge 10% fee if dates or room type changed
    if (
      newBookingData.room && newBookingData.room.roomNumber !== prevRoom.roomNumber ||
      newBookingData.checkIn && newBookingData.checkIn !== prevCheckIn ||
      newBookingData.checkOut && newBookingData.checkOut !== prevCheckOut
    ) {
      modificationFee = Math.round(oldTotal * 0.10);
    }
    // If upgrade (room price increased), charge difference as upgradeAmount
    if (newTotal > oldTotal) {
      upgradeAmount = newTotal - oldTotal;
    }
    // If downgrade (room price decreased), refund difference
    if (newTotal < oldTotal) {
      refundAmount = oldTotal - newTotal;
    }
    this.currentBooking.modificationFee = modificationFee;
    this.currentBooking.upgradeAmount = upgradeAmount;
    this.currentBooking.refundAmount = refundAmount;
    this.currentBooking.status = 'confirmed'; // Set status to confirmed after modification
    this.currentBooking.modificationCount += 1;
    // Save updated booking in localStorage
    const bookingsStr = localStorage.getItem('hotel_bookings');
    let bookings: Booking[] = bookingsStr ? JSON.parse(bookingsStr) : [];
    const idx = bookings.findIndex(b => b.reference === this.currentBooking.reference);
    if (idx !== -1) {
      bookings[idx] = { ...this.currentBooking };
      localStorage.setItem('hotel_bookings', JSON.stringify(bookings));
    }
    // Optionally, update room status if room changed
    if (newBookingData.room && newBookingData.room.roomNumber !== prevRoom.roomNumber) {
      const roomsStr = localStorage.getItem('hotel_rooms');
      if (roomsStr) {
        const rooms = JSON.parse(roomsStr);
        // Free previous room
        const prevIdx = rooms.findIndex((r: any) => r.roomNumber == prevRoom.roomNumber);
        if (prevIdx !== -1) rooms[prevIdx].status = 'Available';
        // Occupy new room
        const newIdx = rooms.findIndex((r: any) => r.roomNumber == newBookingData.room!.roomNumber);
        if (newIdx !== -1) rooms[newIdx].status = 'Occupied';
        localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
      }
    }
    // UI feedback (could be a toast/snackbar in real app)
    this.formErrors.push('Booking modified successfully.');
  }
}
