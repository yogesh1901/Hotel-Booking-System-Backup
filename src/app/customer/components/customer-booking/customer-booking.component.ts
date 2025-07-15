// customer-booking.component.ts
import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Booking {
  id: number;
  BookingId?: string;
  roomType: string;
  roomNumber?: string;
  checkIn: Date;
  checkOut: Date;
  guests: string;
  amount: number;
  status: 'confirmed' | 'completed' | 'cancelled' | 'modified';
  adminMessage?: string;
  cancelBooking: boolean;
  cancelCharges?: number;
  refundAmount?: number;
  modificationCount?: number;
  modificationFee?: number;
  originalAmount?: number;
}

@Component({
  selector: 'app-customer-booking',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './customer-booking.component.html',
  styleUrls: ['./customer-booking.component.css']
})
export class CustomerBookingComponent {
  showCancelTermsModal = false;
  cancelBookingId: string | null = null;
  filter = signal<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  today = new Date();
  selectedBooking: Booking | null = null;
  showViewModal = false;
  showModifyModal = false;
  showConfirmModal = false;
  modalTitle = '';
  modalMessage = '';
  confirmAction: () => void = () => {};
  
  modificationRequest = {
    roomType: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    message: ''
  };

  bookings = signal<Booking[]>([]);
  hotelRooms: any[] = [];
  availableRoomNumbers: string[] = [];
  roomTypes: string[] = [];

  ngOnInit() {
    this.loadBookingsFromLocalStorage();
    this.loadHotelRoomsFromLocalStorage();
  }

  canCancelBooking(booking: any): boolean {
    const today = new Date();
    const checkInDate = new Date(booking.checkIn);
    today.setHours(0, 0, 0, 0);
    checkInDate.setHours(0, 0, 0, 0);
    
    const oneDayBefore = new Date(checkInDate);
    oneDayBefore.setDate(checkInDate.getDate() - 1);
    
    return booking.status === 'confirmed' && 
           today < oneDayBefore && 
           !booking.cancelBooking &&
           (booking.modificationCount === undefined || booking.modificationCount < 1);
  }

  canModifyBooking(booking: any): boolean {
    const today = new Date();
    const checkInDate = new Date(booking.checkIn);
    today.setHours(0, 0, 0, 0);
    checkInDate.setHours(0, 0, 0, 0);
    
    const oneDayBefore = new Date(checkInDate);
    oneDayBefore.setDate(checkInDate.getDate() - 1);
    
    return booking.status === 'confirmed' && 
           today < oneDayBefore && 
           !booking.cancelBooking &&
           (booking.modificationCount === undefined || booking.modificationCount < 1);
  }

  openCancelTermsModal(booking: any) {
    this.selectedBooking = booking;
    this.cancelBookingId = booking.BookingId;
    this.showCancelTermsModal = true;
  }

  cancelCancelBooking() {
    this.showCancelTermsModal = false;
    this.cancelBookingId = null;
    this.selectedBooking = null;
  }

  confirmCancelBooking() {
    if (!this.cancelBookingId || !this.selectedBooking) return;
    
    let bookingsArr = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
    const idx = bookingsArr.findIndex((b: any) => b.BookingId === this.cancelBookingId);
    
    if (idx === -1) {
      alert('Booking not found for cancellation.');
      this.showCancelTermsModal = false;
      this.cancelBookingId = null;
      this.selectedBooking = null;
      return;
    }

    const booking = bookingsArr[idx];
    
    const today = new Date();
    const checkInDate = new Date(booking.checkIn);
    today.setHours(0, 0, 0, 0);
    checkInDate.setHours(0, 0, 0, 0);
    
    const oneDayBefore = new Date(checkInDate);
    oneDayBefore.setDate(checkInDate.getDate() - 1);
    
    if (today >= oneDayBefore) {
      alert('Cancellation not allowed within 24 hours of check-in.');
      this.showCancelTermsModal = false;
      this.cancelBookingId = null;
      this.selectedBooking = null;
      return;
    }

    booking.cancelBooking = true;
    booking.status = 'cancelled';
    const price = booking.originalAmount || booking.amount || (booking.room?.price || 2000) * 
                 Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    
    booking.cancelCharges = Math.round(price * 0.3);
    booking.refundAmount = Math.round(price * 0.7);
    
    const roomsStr = localStorage.getItem('hotel_rooms');
    let rooms = roomsStr ? JSON.parse(roomsStr) : [];
    const roomToUpdate = rooms.find((r: any) => r.roomNumber === booking.room?.roomNumber);
    if (roomToUpdate) {
      roomToUpdate.status = 'Available';
      localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
    }

    localStorage.setItem('hotel_bookings', JSON.stringify(bookingsArr));
    this.loadBookingsFromLocalStorage();
    
    alert(`Booking ${booking.BookingId} cancelled. Refund: ₹${booking.refundAmount}`);
    this.showCancelTermsModal = false;
    this.cancelBookingId = null;
    this.selectedBooking = null;
  }

  loadBookingsFromLocalStorage() {
    let user: any = null;
    const sessionUserStr = sessionStorage.getItem('currentUser');
    if (sessionUserStr) {
      user = JSON.parse(sessionUserStr);
    } else {
      const rememberUserStr = localStorage.getItem('rememberUser');
      if (rememberUserStr) {
        const rememberUser = JSON.parse(rememberUserStr);
        user = Array.isArray(rememberUser) ? rememberUser[0] : rememberUser;
      }
    }
    const userEmail = user?.username;
    if (!userEmail) return;
    
    const bookingsStr = localStorage.getItem('hotel_bookings');
    if (bookingsStr) {
      const bookingsArr = JSON.parse(bookingsStr);
      const userBookings = bookingsArr.filter((b: any) => b?.bookingEmail === userEmail);
      
      this.bookings.set(userBookings.map((b: any, idx: number) => {
        const checkInDate = new Date(b.checkIn);
        const checkOutDate = new Date(b.checkOut);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let basePrice = (b.room?.price || 0) * nights;
        let extraGuestCharge = 0;
        const totalGuests = (b.adults || 1) + (b.children || 0);
        
        if (totalGuests > 2 && b.room?.price) {
          extraGuestCharge = b.room.price * 0.2 * (totalGuests - 2) * nights;
        }
        
        const totalAmount = b.totalAmount || b.amount || Math.round((basePrice + extraGuestCharge) * 1.18);
        
        return {
          id: idx + 1,
          BookingId: b.BookingId,
          roomType: b.room?.type ? this.getRoomTypeName(b.room.type) : 'Room',
          roomNumber: b.room?.roomNumber,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: `${b.adults || 1} Adult${b.adults > 1 ? 's' : ''}${b.children ? ', ' + b.children + ' Child' + (b.children > 1 ? 'ren' : '') : ''}`,
          amount: totalAmount,
          status: b.status || 'confirmed',
          adminMessage: b.adminMessage || '',
          cancelBooking: b.cancelBooking === true,
          cancelCharges: b.cancelCharges || 0,
          refundAmount: b.refundAmount || 0,
          modificationCount: b.modificationCount || 0,
          modificationFee: b.modificationFee || 0,
          originalAmount: b.originalAmount || totalAmount
        };
      }));
    }
  }

  loadHotelRoomsFromLocalStorage() {
    const roomsStr = localStorage.getItem('hotel_rooms');
    if (roomsStr) {
      this.hotelRooms = JSON.parse(roomsStr);
      this.roomTypes = [...new Set(this.hotelRooms.map((room: any) => this.getRoomTypeName(room.type)))];
    }
  }

  getRoomTypeName(type: string): string {
    const typeNames: Record<string, string> = {
      standard: 'Standard Room',
      deluxe: 'Deluxe Room',
      executive: 'Executive Suite',
      presidential: 'Presidential Suite',
      premium: 'Premium Suite',
    };
    return typeNames[type] || type;
  }

  getRoomTypeKey(typeName: string): string {
    const typeMap: Record<string, string> = {
      'Standard Room': 'standard',
      'Deluxe Room': 'deluxe',
      'Executive Suite': 'executive',
      'Presidential Suite': 'presidential',
      'Premium Suite': 'premium',
    };
    return typeMap[typeName] || typeName;
  }

  filteredBookings() {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    switch (this.filter()) {
      case 'upcoming':
        return this.bookings().filter(booking => 
          booking.status === 'confirmed' && 
          (booking.checkIn >= this.today || 
           (booking.checkIn <= this.today && booking.checkOut >= this.today))
        );
      case 'past':
        return this.bookings().filter(booking => 
          booking.status === 'completed' || 
          booking.checkOut < this.today
        );
      case 'cancelled':
        return this.bookings().filter(booking => 
          booking.status === 'cancelled'
        );
      default:
        return this.bookings();
    }
  }

  setFilter(type: 'all' | 'upcoming' | 'past' | 'cancelled') {
    this.filter.set(type);
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'confirmed': return 'bg-amber-400 text-black';
      case 'completed': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      case 'modified': return 'bg-blue-500 text-white';
      default: return 'bg-gray-400 text-black';
    }
  }

  getStatusIcon(status: string) {
    switch (status) {
      case 'confirmed': return 'fa-check-circle';
      case 'completed': return 'fa-check-circle';
      case 'cancelled': return 'fa-times-circle';
      case 'modified': return 'fa-pen';
      default: return 'fa-question-circle';
    }
  }

  formatDate(date: Date) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  viewDetails(booking: Booking) {
    this.selectedBooking = booking;
    this.showViewModal = true;
  }

  openModifyModal(booking: Booking) {
    this.selectedBooking = booking;
    let adults = 1, children = 0;
    const match = booking.guests.match(/(\d+) Adult/);
    if (match) adults = parseInt(match[1], 10);
    const childMatch = booking.guests.match(/(\d+) Child/);
    if (childMatch) children = parseInt(childMatch[1], 10);
    
    this.modificationRequest = {
      roomType: booking.roomType,
      roomNumber: booking.roomNumber || '',
      checkIn: this.formatDateForInput(booking.checkIn),
      checkOut: this.formatDateForInput(booking.checkOut),
      adults,
      children,
      message: ''
    };
    this.updateAvailableRoomNumbers();
    this.showModifyModal = true;
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  updateAvailableRoomNumbers() {
    const typeKey = this.getRoomTypeKey(this.modificationRequest.roomType);
    const checkIn = this.modificationRequest.checkIn;
    const checkOut = this.modificationRequest.checkOut;
    
    if (!typeKey || !checkIn || !checkOut) {
      this.availableRoomNumbers = [];
      return;
    }
    
    const bookingsStr = localStorage.getItem('hotel_bookings');
    const bookings = bookingsStr ? JSON.parse(bookingsStr) : [];
    
    this.availableRoomNumbers = this.hotelRooms
      .filter(room => room.type === typeKey)
      .filter(room => {
        const overlapping = bookings.some((booking: any) =>
          booking.room?.roomNumber === room.roomNumber &&
          ((booking.checkIn < checkOut) && (booking.checkOut > checkIn)) &&
          booking.status !== 'cancelled'
        );
        return !overlapping && room.status === 'Available';
      })
      .map(room => room.roomNumber);
  }

  onModifyFieldChange() {
    this.updateAvailableRoomNumbers();
  }

  submitModificationRequest() {
    if (!this.selectedBooking) return;

    const checkInDate = new Date(this.modificationRequest.checkIn);
    const checkOutDate = new Date(this.modificationRequest.checkOut);
    
    if (this.isPastDate(checkInDate)) {
      alert('Check-in date cannot be in the past');
      return;
    }
    
    if (checkOutDate <= checkInDate) {
      alert('Check-out date must be after check-in date');
      return;
    }

    const today = new Date();
    const originalCheckIn = new Date(this.selectedBooking.checkIn);
    today.setHours(0, 0, 0, 0);
    originalCheckIn.setHours(0, 0, 0, 0);
    
    const oneDayBefore = new Date(originalCheckIn);
    oneDayBefore.setDate(originalCheckIn.getDate() - 1);
    
    if (today >= oneDayBefore) {
      alert('Modification not allowed within 24 hours of check-in.');
      return;
    }

    const newRoom = this.hotelRooms.find(r => r.roomNumber === this.modificationRequest.roomNumber);
    const totalGuests = Number(this.modificationRequest.adults) + Number(this.modificationRequest.children);
    
    if (newRoom && newRoom.capacity && totalGuests > newRoom.capacity) {
      alert(`Selected room can accommodate up to ${newRoom.capacity} guests. Please adjust adults/children.`);
      return;
    }

    let user: any = null;
    const sessionUserStr = sessionStorage.getItem('currentUser');
    if (sessionUserStr) {
      user = JSON.parse(sessionUserStr);
    } else {
      const rememberUserStr = localStorage.getItem('rememberUser');
      if (rememberUserStr) {
        const rememberUser = JSON.parse(rememberUserStr);
        user = Array.isArray(rememberUser) ? rememberUser[0] : rememberUser;
      }
    }
    const userEmail = user?.username;
    if (!userEmail) return;

    const bookingsStr = localStorage.getItem('hotel_bookings');
    let bookings = bookingsStr ? JSON.parse(bookingsStr) : [];
    const bookingIdx = bookings.findIndex((b: any) =>
      b.bookingEmail === userEmail &&
      b.room?.roomNumber === this.selectedBooking!.roomNumber &&
      new Date(b.checkIn).toISOString().split('T')[0] === this.formatDateForInput(this.selectedBooking!.checkIn)
    );

    if (bookingIdx !== -1) {
      const booking = bookings[bookingIdx];
      const oldRoom = this.hotelRooms.find(r => r.roomNumber === booking.room?.roomNumber);
      const newRoom = this.hotelRooms.find(r => r.roomNumber === this.modificationRequest.roomNumber);
      
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const oldPrice = booking.originalAmount || booking.amount || (oldRoom?.price || 2000) *
        Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));
      
      let newBase = (newRoom?.price || 0) * nights;
      let extraGuestCharge = 0;
      
      if (totalGuests > 2 && newRoom?.price) {
        extraGuestCharge = newRoom.price * 0.2 * (totalGuests - 2) * nights;
      }
      
      const newTotal = Math.round((newBase + extraGuestCharge) * 1.18);
      
      if (newRoom && oldRoom) {
        if (newRoom.price > oldRoom.price) {
          const diff = newTotal - oldPrice;
          if (diff > 0) {
            if (!confirm(`This is an upgrade. Please pay the remaining amount: ₹${diff.toLocaleString('en-IN')}`)) {
              return;
            }
          }
        } else if (newRoom.price < oldRoom.price) {
          const diff = oldPrice - newTotal;
          const refundAmount = Math.round(diff * 0.9);
          alert(`This is a downgrade. ₹${refundAmount.toLocaleString('en-IN')} will be refunded to your account (10% modification fee applied).`);
        }
      }

      booking.checkIn = this.modificationRequest.checkIn;
      booking.checkOut = this.modificationRequest.checkOut;
      const typeKey = this.getRoomTypeKey(this.modificationRequest.roomType);
      booking.room.type = typeKey;
      booking.room.roomNumber = this.modificationRequest.roomNumber;
      booking.adults = Number(this.modificationRequest.adults);
      booking.children = Number(this.modificationRequest.children);
      booking.amount = newTotal;
      booking.status = 'modified';
      booking.modificationCount = (booking.modificationCount || 0) + 1;
      booking.modificationFee = newRoom && oldRoom && newRoom.price < oldRoom.price ? 
                               Math.round((oldPrice - newTotal) * 0.1) : 0;
      
      if (!booking.originalAmount) {
        booking.originalAmount = oldPrice;
      }

      localStorage.setItem('hotel_bookings', JSON.stringify(bookings));
      this.loadBookingsFromLocalStorage();
      this.showModifyModal = false;
    }
  }

  closeModal() {
    this.showViewModal = false;
    this.showModifyModal = false;
    this.showConfirmModal = false;
    this.showCancelTermsModal = false;
    this.selectedBooking = null;
  }

  printBooking(booking: Booking) {
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h1 style="text-align: center; margin-bottom: 20px;">Booking Receipt</h1>
        <div style="border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
          <h2 style="margin-top: 0;">${booking.roomType} ${booking.roomNumber ? '(Room ' + booking.roomNumber + ')' : ''}</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <strong>Check In:</strong> ${this.formatDate(booking.checkIn)}
            </div>
            <div>
              <strong>Check Out:</strong> ${this.formatDate(booking.checkOut)}
            </div>
            <div>
              <strong>Guests:</strong> ${booking.guests}
            </div>
            <div>
              <strong>Status:</strong> ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
          </div>
          <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong style="font-size: 18px;">Total Amount:</strong>
              <span style="font-size: 20px; font-weight: bold;">₹${booking.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
          ${booking.adminMessage ? `
          <div style="margin-top: 15px; padding: 10px; background-color: #fff8e1; border-radius: 5px;">
            <strong>Note:</strong> ${booking.adminMessage}
          </div>
          ` : ''}
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
          Printed on ${new Date().toLocaleDateString()}
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Booking Receipt</title>
            <style>
              @media print {
                body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }
  confirmActionHandler() {
  if (this.confirmAction) {
    this.confirmAction();
  }
  this.showConfirmModal = false;
}
}