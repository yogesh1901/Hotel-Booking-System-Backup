// roombooking.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

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
  room: Room;
  checkIn: string;
  checkOut: string;
  guestInfo: GuestInfo;
  paymentInfo: PaymentInfo;
  reference: string;
  termsAgreed: boolean;
  adults: number;
  children: number;
  rooms: number;
  cancelBooking: boolean; // Ensure this is present
  status?: string; // Add status for cancellation logic
}

@Component({
  selector: 'app-roombooking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roombooking.component.html',
  styleUrls: ['./roombooking.component.css']
})
export class RoombookingComponent implements OnInit {
  // Current date for date inputs
  today = new Date();
  tomorrow = new Date(this.today);
  
  // Room data
  rooms: Room[] = [];

  // Initialize with default values
  currentBooking: Booking = {
    room: undefined as any, // Will be set in ngOnInit
    checkIn: '', // Start with empty check-in
    checkOut: '', // Start with empty check-out
    guestInfo: {
      name: '',
      email: '',
      phone: '',
      requests: ''
    },
    paymentInfo: {
      method: 'credit',
      creditCard: {
        number: '',
        expiry: '',
        cvv: '',
        name: ''
      },
      paypal: {
        email: ''
      },
      bankTransfer: {
        accountNumber: '',
        accountName: '',
        ifsc: ''
      },
      upi: {
        id: ''
      }
    },
    reference: '',
    termsAgreed: false,
    adults: 1,
    children: 0,
    rooms: 1,
    cancelBooking: false // Default to not cancelled
  };

  // Filter and pagination variables
  filteredRooms: Room[] = [];
  roomsPerPage = 6;
  currentPage = 1;
  activePage: 'search' | 'booking' | 'confirmation' = 'search';
  
  // Filter controls
  priceRange = 20000; // Increased to show all room types by default
  searchTerm = '';
  selectedTypes: string[] = [];
  selectedAmenities: string[] = [];
  
  // Payment method options
  paymentMethods = [
    { value: 'credit', label: 'Credit/Debit Card', icon: 'credit_card' },
    { value: 'paypal', label: 'PayPal', icon: 'payments' },
    { value: 'bank', label: 'Bank Transfer', icon: 'account_balance' },
    { value: 'upi', label: 'UPI Payment', icon: 'qr_code' }
  ];

  // Booking for: 'self' or 'other'
  bookingFor: 'self' | 'other' = 'self';

  // Form validation errors
  formErrors: string[] = [];

  public Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) {
    console.log('RoombookingComponent constructed');
    this.tomorrow.setDate(this.today.getDate() + 1);
    // Check for query params from hero component
    this.route.queryParams.subscribe(params => {
      if (params['checkIn'] && params['checkOut']) {
        this.currentBooking.checkIn = params['checkIn'];
        this.currentBooking.checkOut = params['checkOut'];
        this.applyDates();
      }
      if (params['guests']) {
        // You can use this to filter rooms by capacity
      }
      if (params['rooms']) {
        // You can use this if needed
      }
    });
  }

  ngOnInit() {
    this.initializeRoomsInLocalStorage();
    this.loadRoomsFromLocalStorage();
    // If redirected from login after Book Now, auto-select the room
    const roomNumber = this.route.snapshot.queryParamMap.get('roomId');
    if (roomNumber) {
      const room = this.rooms.find(r => r.roomNumber == roomNumber);
      if (room) {
        this.currentBooking.room = room;
        this.activePage = 'booking';
      } else {
        this.currentBooking.room = this.rooms[0];
      }
    } else {
      this.currentBooking.room = this.rooms[0];
    }
    // If redirected from hero or with guest info, prefill
    const params = this.route.snapshot.queryParams;
    // Only set if value is present
    if (params['guestName']) this.currentBooking.guestInfo.name = params['guestName'];
    if (params['guestEmail']) this.currentBooking.guestInfo.email = params['guestEmail'];
    if (params['guestPhone']) this.currentBooking.guestInfo.phone = params['guestPhone'];
    // Default to 'self' if logged in, else 'other'
    this.bookingFor = this.authService.isAuthenticated() ? 'self' : 'other';
    // Always refresh guest info for 'self' on init
    if (this.bookingFor === 'self') this.prefillSelfGuestInfo(params);
    else this.currentBooking.guestInfo = { name: '', email: '', phone: '', aadhar: '', requests: '' };

    // Only set check-in/check-out defaults if not set by query params
    if (!this.currentBooking.checkIn) {
      this.currentBooking.checkIn = '';
    }
    if (!this.currentBooking.checkOut) {
      this.currentBooking.checkOut = '';
    }
    // If dates are set (from hero), ensure they are not in the past
    if (this.currentBooking.checkIn) {
      const today = new Date();
      const minDate = today.toISOString().split('T')[0];
      if (this.currentBooking.checkIn < minDate) {
        this.currentBooking.checkIn = minDate;
      }
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const minCheckOut = tomorrow.toISOString().split('T')[0];
      if (!this.currentBooking.checkOut || this.currentBooking.checkOut <= this.currentBooking.checkIn) {
        this.currentBooking.checkOut = minCheckOut;
      } else if (this.currentBooking.checkOut < minCheckOut) {
        this.currentBooking.checkOut = minCheckOut;
      }
    }
    this.filteredRooms = [...this.rooms];
    this.migrateBookingsAddCancelBooking();
  }

  // Load rooms from localStorage
  loadRoomsFromLocalStorage() {
    const roomsStr = localStorage.getItem('hotel_rooms');
    if (roomsStr) {
      this.rooms = JSON.parse(roomsStr).map((room: any) => ({
        ...room,
        name: this.getRoomTypeName(room.type) + ' #' + room.roomNumber,
        description: 'A beautiful ' + this.getRoomTypeName(room.type) + ' with all amenities.',
        size: room.capacity ? (room.capacity * 20 + ' sqm') : undefined
      }));
    } else {
      this.rooms = [];
    }
  }

  prefillSelfGuestInfo(params?: any) {
    // If params are present and valid, prefer them
    if (params && (params['guestName'] || params['guestEmail'] || params['guestPhone'])) {
      this.currentBooking.guestInfo = {
        name: params['guestName'] || '',
        email: params['guestEmail'] || '',
        phone: params['guestPhone'] || '',
        aadhar: '',
        requests: this.currentBooking.guestInfo.requests || ''
      };
      return;
    }
    // Otherwise, fetch from storage
    let user: any = null;
    const sessionUserStr = sessionStorage.getItem('currentUser');
    if (sessionUserStr) {
      user = JSON.parse(sessionUserStr);
    } else {
      const rememberUserStr = localStorage.getItem('rememberUser');
      if (rememberUserStr) {
        const rememberUser = JSON.parse(rememberUserStr);
        if (Array.isArray(rememberUser)) {
          user = rememberUser[0];
        } else {
          user = rememberUser;
        }
      }
    }
    // If user not found or missing name/email/phone, try hotel_customers
    if (!user || !user.name || !user.email || !user.phone) {
      const hotelCustomersStr = localStorage.getItem('hotel_customers');
      if (hotelCustomersStr) {
        const hotelCustomers = JSON.parse(hotelCustomersStr);
        if (Array.isArray(hotelCustomers) && hotelCustomers.length > 0) {
          user = hotelCustomers[0];
        }
      }
    }
    if (user) {
      this.currentBooking.guestInfo = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        aadhar: user.aadhar || user.aadhar || '',
        requests: this.currentBooking.guestInfo.requests || ''
      };
      if (!user.aadhar) {
        this.currentBooking.guestInfo.aadhar = '';
      }
    } else {
      // If no user found, clear guest info
      this.currentBooking.guestInfo = { name: '', email: '', phone: '', aadhar: '', requests: '' };
    }
  }

  onBookingForChange() {
    if (this.bookingFor === 'self') {
      this.prefillSelfGuestInfo();
    } else {
      this.currentBooking.guestInfo = { name: '', email: '', phone: '', aadhar: '', requests: '' };
    }
  }

  public goToHome() {
    this.router.navigate(['/']);
  }

  public applyDates() {
    if (!this.currentBooking.checkIn || !this.currentBooking.checkOut) {
      alert("Please select both check-in and check-out dates");
      return;
    }
    const checkIn = new Date(this.currentBooking.checkIn);
    const checkOut = new Date(this.currentBooking.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkIn < today) {
      alert("Check-in date cannot be in the past");
      return;
    }
    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date");
      return;
    }
    if (this.calculateNights() > 30) {
      alert("Maximum stay duration is 30 nights");
      return;
    }
    this.filterRooms();
  }

  // Format date as YYYY-MM-DD
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Format date for display (e.g., "15 Jan 2023")
  formatDisplayDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  // Get amenity display name
  getAmenityName(amenity: string): string {
    const amenityNames: Record<string, string> = {
      wifi: "Free WiFi",
      ac: "Air Conditioning",
      pool: "Swimming Pool",
      restaurant: "Restaurant",
      spa: "Spa"
    };
    return amenityNames[amenity] || amenity;
  }

  public getUniqueRoomTypes(): string[] {
    return [...new Set(this.rooms.map(room => room.type))];
  }

  public getUniqueAmenities(): string[] {
    const allAmenities = this.rooms.flatMap(room => room.amenities);
    return [...new Set(allAmenities)];
  }

  public getRoomTypeName(type: string): string {
    const typeNames: Record<string, string> = {
      standard: "Standard Room",
      deluxe: "Deluxe Room",
      executive: "Executive Suite",
      presidential: "Presidential Suite"
    };
    return typeNames[type] || type;
  }

  // Filter rooms based on selected filters, booking availability, and guest count
  filterRooms() {
    const searchTerm = this.searchTerm.toLowerCase();
    const maxPriceValue = this.priceRange;
    const checkIn = this.currentBooking.checkIn;
    const checkOut = this.currentBooking.checkOut;
    const guestCount = this.currentBooking.adults + this.currentBooking.children;
    // Get all bookings
    const bookingsStr = localStorage.getItem('hotel_bookings');
    const bookings: Booking[] = bookingsStr ? JSON.parse(bookingsStr) : [];

    this.filteredRooms = this.rooms.filter(room => {
      // Only show rooms that are available for the selected dates
      const overlapping = bookings.some(booking =>
        booking.room.roomNumber === room.roomNumber &&
        ((booking.checkIn < checkOut) && (booking.checkOut > checkIn)) &&
        booking.cancelBooking !== true && booking.status !== 'cancelled'
      );
      if (overlapping) return false;
      // Filter by guest count (room capacity)
      if (guestCount > room.capacity) {
        return false;
      }
      // Filter by search term
      if (searchTerm && !room.type.toLowerCase().includes(searchTerm)) {
        return false;
      }
      // Filter by price
      if (room.price > maxPriceValue) {
        return false;
      }
      // Filter by room type
      if (this.selectedTypes.length > 0 && !this.selectedTypes.includes(room.type)) {
        return false;
      }
      // Filter by amenities
      if (this.selectedAmenities.length > 0) {
        const hasAllAmenities = this.selectedAmenities.every(amenity =>
          room.amenities.includes(amenity)
        );
        if (!hasAllAmenities) {
          return false;
        }
      }
      return true;
    });
    this.currentPage = 1;
  }

  // Reset all filters
  resetFilters() {
    this.priceRange = 10000;
    this.searchTerm = '';
    this.selectedTypes = [];
    this.selectedAmenities = [];
    this.currentBooking.checkIn = this.formatDate(this.today);
    this.currentBooking.checkOut = this.formatDate(this.tomorrow);
    this.filteredRooms = [...this.rooms];
    this.currentPage = 1;
  }

  public resetBooking() {
    this.resetFilters();
    this.activePage = 'search';
    this.currentBooking.guestInfo = {
      name: '',
      email: '',
      phone: '',
      requests: ''
    };
    this.currentBooking.paymentInfo = {
      method: 'credit',
      creditCard: {
        number: '',
        expiry: '',
        cvv: '',
        name: ''
      },
      paypal: {
        email: ''
      },
      bankTransfer: {
        accountNumber: '',
        accountName: '',
        ifsc: ''
      },
      upi: {
        id: ''
      }
    };
    this.currentBooking.termsAgreed = false;
  }

  // Toggle room type selection
  toggleRoomType(type: string) {
    const index = this.selectedTypes.indexOf(type);
    if (index === -1) {
      this.selectedTypes.push(type);
    } else {
      this.selectedTypes.splice(index, 1);
    }
    this.filterRooms();
  }

  // Toggle amenity selection
  toggleAmenity(amenity: string) {
    const index = this.selectedAmenities.indexOf(amenity);
    if (index === -1) {
      this.selectedAmenities.push(amenity);
    } else {
      this.selectedAmenities.splice(index, 1);
    }
    this.filterRooms();
  }

  // Start booking process for a room
  startBookingProcess(room: Room): void {
    if (this.authService.isAuthenticated()) {
      this.currentBooking.room = room;
      this.activePage = 'booking';
    } else {
      sessionStorage.setItem('intendedRoomId', room.roomNumber.toString());
      this.router.navigate(['/login'], { 
        queryParams: { 
          redirect: 'room-booking',
          roomId: room.roomNumber,
          checkIn: this.currentBooking.checkIn,
          checkOut: this.currentBooking.checkOut
        } 
      });
    }
  }

  // Navigate to booking form component, checking login status and room availability
  goToBookingForm(room: Room) {
    // Check for valid check-in and check-out dates
    if (!this.currentBooking.checkIn || !this.currentBooking.checkOut) {
      alert('Please select both check-in and check-out dates before booking.');
      return;
    }
    const checkIn = this.currentBooking.checkIn;
    const checkOut = this.currentBooking.checkOut;
    const guestCount = this.currentBooking.adults + this.currentBooking.children;
    if (guestCount > room.capacity) {
      alert('Guest count exceeds the capacity of this room. Please select a room with higher capacity or reduce the number of guests.');
      return;
    }
    // Check if room is available for the selected dates
    const bookingsStr = localStorage.getItem('hotel_bookings');
    const bookings: Booking[] = bookingsStr ? JSON.parse(bookingsStr) : [];
    const overlapping = bookings.some(booking =>
      booking.room.roomNumber === room.roomNumber &&
      ((booking.checkIn < checkOut) && (booking.checkOut > checkIn)) &&
      booking.cancelBooking !== true && booking.status !== 'cancelled'
    );
    if (overlapping) {
      alert('This room is not available for the selected dates. Please choose different dates or another room.');
      return;
    }
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/booking-form'], {
        queryParams: {
          roomNumber: room.roomNumber,
          checkIn: this.currentBooking.checkIn,
          checkOut: this.currentBooking.checkOut,
          adults: this.currentBooking.adults,
          children: this.currentBooking.children
        }
      });
    } else {
      // Save intended room and redirect to login
      sessionStorage.setItem('intendedRoomNumber', room.roomNumber);
      this.router.navigate(['/login'], {
        queryParams: {
          redirect: 'booking-form',
          roomNumber: room.roomNumber,
          checkIn: this.currentBooking.checkIn,
          checkOut: this.currentBooking.checkOut,
          adults: this.currentBooking.adults,
          children: this.currentBooking.children
        }
      });
    }
  }

  // Calculate nights between check-in and check-out
  calculateNights(): number {
    const checkInDate = new Date(this.currentBooking.checkIn);
    const checkOutDate = new Date(this.currentBooking.checkOut);
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Calculate total price
  calculateTotal(): number {
    const nights = this.calculateNights();
    if (!this.currentBooking.room) return 0;
    let basePrice = this.currentBooking.room.price * nights;
    let extraGuestCharge = 0;
    const totalGuests = this.currentBooking.adults + this.currentBooking.children;
    // Charge 20% of room price for each extra guest beyond 2
    if (totalGuests > 2) {
      extraGuestCharge = this.currentBooking.room.price * 0.2 * (totalGuests - 2) * nights;
    }
    return Math.round((basePrice + extraGuestCharge) * 1.18); // 18% tax
  }

  // Check room availability for overlapping bookings
  private checkRoomAvailability(roomId: number, checkIn: string, checkOut: string): boolean {
    const bookingsStr = localStorage.getItem('hotel_bookings');
    if (!bookingsStr) return true;
    const bookings: Booking[] = JSON.parse(bookingsStr);
    const overlappingBookings = bookings.filter(booking => 
      Number(booking.room.roomNumber) === Number(roomId) &&
      ((booking.checkIn >= checkIn && booking.checkIn < checkOut) ||
       (booking.checkOut > checkIn && booking.checkOut <= checkOut) ||
       (booking.checkIn <= checkIn && booking.checkOut >= checkOut))
    );
    return overlappingBookings.length < 5;
  }

  // Confirm booking
  confirmBooking() {
    alert('confirmBooking CALLED!');
    console.log('confirmBooking called');
    this.formErrors = [];
    if (this.bookingFor === 'other') {
      // Validate guest info fields for 'someone else'
      if (!this.currentBooking.guestInfo.name?.trim()) {
        this.formErrors.push('Full Name is required.');
      }
      if (!this.currentBooking.guestInfo.email?.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.currentBooking.guestInfo.email)) {
        this.formErrors.push('A valid Email Address is required.');
      }
      if (!this.currentBooking.guestInfo.phone?.trim() || !/^\d{10,15}$/.test(this.currentBooking.guestInfo.phone)) {
        this.formErrors.push('A valid Phone Number is required (10-15 digits).');
      }
      if (!this.currentBooking.guestInfo.aadhar?.trim() || !/^\d{12}$/.test(this.currentBooking.guestInfo.aadhar)) {
        this.formErrors.push('Aadhaar Number is required (12 digits).');
      }
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
    if (this.formErrors.length > 0) {
      return;
    }
    if (!this.validateBookingForm()) {
      return;
    }
    // Ensure check-in/check-out are not in the past before confirming
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    if (this.currentBooking.checkIn < minDate) {
      this.currentBooking.checkIn = minDate;
    }
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const minCheckOut = tomorrow.toISOString().split('T')[0];
    if (this.currentBooking.checkOut <= this.currentBooking.checkIn) {
      this.currentBooking.checkOut = minCheckOut;
    } else if (this.currentBooking.checkOut < minCheckOut) {
      this.currentBooking.checkOut = minCheckOut;
    }
    // Check room availability
    if (!this.checkRoomAvailability(
      Number(this.currentBooking.room.roomNumber),
      this.currentBooking.checkIn,
      this.currentBooking.checkOut
    )) {
      alert('This room is already booked to capacity for the selected dates. Please choose different dates or another room.');
      return;
    }
    // Generate booking reference
    this.currentBooking.reference = 'BK' + Math.floor(100000 + Math.random() * 900000).toString();

    // Explicitly set cancelBooking to false
    this.currentBooking.cancelBooking = false;
    console.log('Before saving - cancelBooking:', this.currentBooking.cancelBooking);

    // Save booking to localStorage
    this.saveBookingToLocalStorage();

    // Verify the saved data
    setTimeout(() => {
      const savedBookings = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
      const lastBooking = savedBookings[savedBookings.length - 1];
      console.log('After saving - last booking:', lastBooking);
      console.log('cancelBooking exists:', 'cancelBooking' in lastBooking);
    }, 100);

    // If self booking and Aadhaar was entered, update user profile
    if (this.bookingFor === 'self' && this.currentBooking.guestInfo.aadhar) {
      this.updateUserAadhar(this.currentBooking.guestInfo.aadhar);
    }
    this.activePage = 'confirmation';
  }

  saveBookingToLocalStorage() {
    // Create a new booking object with all required fields
    const bookingToSave: Booking = {
      room: { ...this.currentBooking.room },
      checkIn: this.currentBooking.checkIn,
      checkOut: this.currentBooking.checkOut,
      guestInfo: { ...this.currentBooking.guestInfo },
      paymentInfo: { ...this.currentBooking.paymentInfo },
      reference: this.currentBooking.reference,
      termsAgreed: this.currentBooking.termsAgreed,
      adults: this.currentBooking.adults,
      children: this.currentBooking.children,
      rooms: this.currentBooking.rooms,
      cancelBooking: false // Explicitly set
    };

    // Validate dates
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    if (bookingToSave.checkIn < minDate) {
      bookingToSave.checkIn = minDate;
    }

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const minCheckOut = tomorrow.toISOString().split('T')[0];
    if (bookingToSave.checkOut <= bookingToSave.checkIn) {
      bookingToSave.checkOut = minCheckOut;
    }

    // Get existing bookings
    const bookingsStr = localStorage.getItem('hotel_bookings');
    let bookings: Booking[] = bookingsStr ? JSON.parse(bookingsStr) : [];

    // Add debug information
    console.log('Saving booking with cancelBooking:', bookingToSave.cancelBooking);

    // Add new booking
    bookings.push(bookingToSave);

    // Save with error handling
    try {
      localStorage.setItem('hotel_bookings', JSON.stringify(bookings));
      console.log('Booking saved with all fields:', bookingToSave);
    } catch (error) {
      console.error('Failed to save booking:', error);
    }
  }

  updateUserAadhar(aadhar: string) {
    const userStr = sessionStorage.getItem('currentUser') || localStorage.getItem('rememberUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.aadhar = aadhar;
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      if (localStorage.getItem('rememberUser')) {
        localStorage.setItem('rememberUser', JSON.stringify(user));
      }
      // Also update in hotel_customers
      const customersStr = localStorage.getItem('hotel_customers');
      if (customersStr) {
        const customers = JSON.parse(customersStr);
        const idx = customers.findIndex((c: any) => c.email === user.email);
        if (idx !== -1) {
          customers[idx].aadhar = aadhar;
          localStorage.setItem('hotel_customers', JSON.stringify(customers));
        }
      }
    }
  }

  // Validate booking form
  validateBookingForm(): boolean {
    // Guest name validation
    if (!this.currentBooking.guestInfo.name?.trim()) {
      alert('Please enter your full name');
      return false;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.currentBooking.guestInfo.email || !emailRegex.test(this.currentBooking.guestInfo.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    // Phone validation (basic check for at least 10 digits)
    if (!this.currentBooking.guestInfo.phone || this.currentBooking.guestInfo.phone.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid phone number');
      return false;
    }
    // Aadhaar validation
    if (this.bookingFor === 'other') {
      if (!this.currentBooking.guestInfo.aadhar || !/^[0-9]{12}$/.test(this.currentBooking.guestInfo.aadhar)) {
        alert('Please enter a valid 12-digit Aadhaar number');
        return false;
      }
    } else if (this.bookingFor === 'self') {
      // For self booking, Aadhaar is just displayed, not validated for edit
    }
    // Payment method specific validations
    switch (this.currentBooking.paymentInfo.method) {
      case 'credit':
        if (!this.currentBooking.paymentInfo.creditCard?.number || 
            !this.currentBooking.paymentInfo.creditCard?.expiry || 
            !this.currentBooking.paymentInfo.creditCard?.cvv || 
            !this.currentBooking.paymentInfo.creditCard?.name) {
          alert('Please complete all credit card details');
          return false;
        }
        break;
      case 'paypal':
        if (!this.currentBooking.paymentInfo.paypal?.email || 
            !emailRegex.test(this.currentBooking.paymentInfo.paypal.email)) {
          alert('Please enter a valid PayPal email address');
          return false;
        }
        break;
      case 'bank':
        if (!this.currentBooking.paymentInfo.bankTransfer?.accountNumber || 
            !this.currentBooking.paymentInfo.bankTransfer?.accountName || 
            !this.currentBooking.paymentInfo.bankTransfer?.ifsc) {
          alert('Please complete all bank transfer details');
          return false;
        }
        break;
      case 'upi':
        if (!this.currentBooking.paymentInfo.upi?.id) {
          alert('Please enter your UPI ID');
          return false;
        }
        break;
    }
    
    // Terms and conditions check
    if (!this.currentBooking.termsAgreed) {
      alert('Please agree to the terms and conditions');
      return false;
    }
    
    // Guest count validation
    if (this.currentBooking.adults < 1) {
      alert('Each room must have at least 1 adult');
      return false;
    }
    if (this.currentBooking.adults + this.currentBooking.children > 5) {
      alert('Maximum 5 guests (adults + children) per room');
      return false;
    }
    
    return true;
  }

  // Pagination methods
  public getPaginatedRooms(): any[] {
    const startIndex = (this.currentPage - 1) * this.roomsPerPage;
    const endIndex = startIndex + this.roomsPerPage;
    return this.filteredRooms.slice(startIndex, endIndex);
  }

  public getTotalPages(): number {
    return Math.ceil(this.filteredRooms.length / this.roomsPerPage);
  }

  public changePage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  public getPagesArray(): number[] {
    const totalPages = this.getTotalPages();
    const maxVisiblePages = 5;
    const pages: number[] = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  }

  // Initialize fixed room data in localStorage if not already present
  initializeRoomsInLocalStorage() {
    if (!localStorage.getItem('hotel_rooms')) {
      const roomTypes = [
        {
          type: 'single',
          name: 'Single Room',
          capacity: 1,
          price: 1500,
          amenities: ['wifi', 'ac', 'TV'],
        },
        {
          type: 'deluxe',
          name: 'Deluxe Room',
          capacity: 2,
          price: 3000,
          amenities: ['wifi', 'ac', 'TV', 'balcony', 'minibar'],
        },
        {
          type: 'superior',
          name: 'Superior Room',
          capacity: 3,
          price: 4500,
          amenities: ['wifi', 'ac', 'TV', 'balcony', 'minibar', 'sofa'],
        },
        {
          type: 'executive',
          name: 'Executive Room',
          capacity: 3,
          price: 6000,
          amenities: ['wifi', 'ac', 'TV', 'balcony', 'minibar', 'work desk', 'coffee maker'],
        },
        {
          type: 'junior',
          name: 'Junior Suite',
          capacity: 4,
          price: 8000,
          amenities: ['wifi', 'ac', 'TV', 'balcony', 'minibar', 'living area', 'bathtub'],
        },
        {
          type: 'presidential',
          name: 'Presidential Suite',
          capacity: 5,
          price: 15000,
          amenities: ['wifi', 'ac', 'TV', 'balcony', 'minibar', 'private pool', 'kitchen', 'butler service'],
        },
      ];
      let fixedRooms: any[] = [];
      let roomNumber = 101;
      roomTypes.forEach(rt => {
        for (let i = 0; i < 10; i++) {
          fixedRooms.push({
            roomNumber: (roomNumber++).toString(),
            type: rt.type,
            name: rt.name + ' #' + (roomNumber - 1),
            capacity: rt.capacity,
            price: rt.price,
            status: 'Available',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            amenities: rt.amenities,
            description: 'A beautiful ' + rt.name + ' with all amenities.',
            size: (rt.capacity * 20) + ' sqm',
          });
        }
      });
      localStorage.setItem('hotel_rooms', JSON.stringify(fixedRooms));
    }
  }

  migrateBookingsAddCancelBooking() {
    const bookingsStr = localStorage.getItem('hotel_bookings');
    if (bookingsStr) {
      let bookings = JSON.parse(bookingsStr);
      let updated = false;
      bookings = bookings.map((b: any) => {
        if (typeof b.cancelBooking === 'undefined') {
          b.cancelBooking = false;
          updated = true;
        }
        return b;
      });
      if (updated) {
        localStorage.setItem('hotel_bookings', JSON.stringify(bookings));
        console.log('Migrated bookings to add cancelBooking property.');
      }
    }
  }
}

