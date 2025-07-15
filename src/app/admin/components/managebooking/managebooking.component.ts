import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Booking {
  id: string;
  bookingId: string;
  customer: string;
  roomType: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: string;
  guests: number;
  requests: string;
  amount: number;
  aadharNumber: string;
  mobileNumber: string;
  response?: string; // Admin message field
}

@Component({
  selector: 'app-managebooking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './managebooking.component.html',
  styleUrls: ['./managebooking.component.css']
})
export class ManagebookingComponent implements OnInit {
  isMobileSidebarOpen = false;
  showViewModal = false;
  showEditModal = false;
  showConfirmationModal = false;
confirmationMessage = '';
actionCallback: () => void = () => {};
toastMessage = '';
showToast = false;
  currentBooking: Booking = {
    id: '',
    bookingId: '',
    customer: '',
    roomType: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    status: '',
    guests: 0,
    requests: '',
    amount: 0,
    aadharNumber: '',
    mobileNumber: ''
  };
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  bookings: Booking[] = [];
  loading = true;
  error = '';

constructor() {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.loading = true;
    const bookingsStr = localStorage.getItem('hotel_bookings');
    if (bookingsStr) {
      const data = JSON.parse(bookingsStr);
      this.bookings = data.map((item: any, idx: number) => ({
        id: item.id || idx.toString(),
        bookingId: item.reference || item.bookingId || `B${(item.id || idx).toString().padStart(3, '0')}`,
        customer: item.guestInfo?.name || item.name || item.fullName || 'Unknown Customer',
        roomType: item.room?.type ? (item.room.type.charAt(0).toUpperCase() + item.room.type.slice(1).replace(/_/g, ' ')) : (item.roomType || 'Standard'),
        roomNumber: item.room?.roomNumber || item.roomNumber || '100',
        checkIn: item.checkIn || '',
        checkOut: item.checkOut || '',
        status: item.status || item.bookingStatus || 'Pending',
        guests: (item.adults || 1) + (item.children || 0) || item.noOfGuests || 1,
        requests: item.guestInfo?.requests || item.specialRequest || 'None',
        amount: item.amount || 2000,
        aadharNumber: item.guestInfo?.aadhar || item.aadharNumber || 'Not Available',
        mobileNumber: item.guestInfo?.phone || item.mobileNumber || 'Not Available'
      }));
    } else {
      this.bookings = [];
    }
    this.loading = false;
  }

  get filteredBookings(): Booking[] {
    if (!this.searchTerm) {
      return this.bookings;
    }
    
    return this.bookings.filter(booking => {
      return (
        booking.bookingId.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        booking.customer.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        booking.roomType.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        booking.roomNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.formatDate(booking.checkIn).toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        this.formatDate(booking.checkOut).toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        booking.status.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }

  get paginatedBookings(): Booking[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBookings.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBookings.length / this.itemsPerPage);
  }

  
// Add these methods to the component class
showConfirmation(message: string, callback: () => void) {
  this.confirmationMessage = message;
  this.actionCallback = callback;
  this.showConfirmationModal = true;
}

confirmAction() {
  this.actionCallback();
  this.closeModal();
}

showToastMessage(message: string, duration: number = 3000) {
  this.toastMessage = message;
  this.showToast = true;
  setTimeout(() => {
    this.showToast = false;
  }, duration);
}

closeModal() {
  this.showViewModal = false;
  this.showEditModal = false;
  this.showConfirmationModal = false;
}

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  openViewModal(booking: Booking) {
    this.currentBooking = { ...booking };
    this.showViewModal = true;
  }

  openEditModal(booking: Booking) {
    this.currentBooking = { ...booking };
    this.showEditModal = true;
  }


deleteBooking(booking: Booking) {
  this.showConfirmation(
    `Are you sure you want to delete booking ${booking.bookingId}? This cannot be undone.`,
    () => {
      // Remove from localStorage
      let bookingsArr = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
      bookingsArr = bookingsArr.filter((b: any, idx: number) => {
        // Try to match by reference, id, or roomNumber+checkIn+customer
        return !(
          (b.reference && b.reference === booking.bookingId) ||
          (b.id && b.id === booking.id) ||
          (b.room?.roomNumber === booking.roomNumber && b.checkIn === booking.checkIn && (b.guestInfo?.name === booking.customer || b.name === booking.customer))
        );
      });
      localStorage.setItem('hotel_bookings', JSON.stringify(bookingsArr));
      this.fetchBookings();
      if (this.filteredBookings.length <= (this.currentPage - 1) * this.itemsPerPage && this.currentPage > 1) {
        this.currentPage--;
      }
      this.showToastMessage(`Booking ${booking.bookingId} deleted successfully!`);
    }
  );
}

// Update the updateBooking method to use the confirmation dialog
updateBooking() {
  this.showConfirmation(
    `Are you sure you want to update booking ${this.currentBooking.bookingId}?`,
    () => {
      let bookingsArr = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
      const idx = bookingsArr.findIndex((b: any) =>
        (b.reference && b.reference === this.currentBooking.bookingId) ||
        (b.id && b.id === this.currentBooking.id) ||
        (b.room?.roomNumber === this.currentBooking.roomNumber && b.checkIn === this.currentBooking.checkIn && (b.guestInfo?.name === this.currentBooking.customer || b.name === this.currentBooking.customer))
      );
      if (idx !== -1) {
        // Only update editable fields
        const prevRoomNumber = bookingsArr[idx].room?.roomNumber || bookingsArr[idx].roomNumber;
        bookingsArr[idx].room = bookingsArr[idx].room || {};
        bookingsArr[idx].room.roomNumber = this.currentBooking.roomNumber;
        bookingsArr[idx].status = this.currentBooking.status;
        bookingsArr[idx].adminMessage = this.currentBooking.response || '';
        localStorage.setItem('hotel_bookings', JSON.stringify(bookingsArr));
        this.fetchBookings();
        this.closeModal();
        this.showToastMessage(`Booking ${this.currentBooking.bookingId} updated successfully!`);
      } else {
        this.showToastMessage('Failed to update booking. Booking not found.');
      }
    }
  );
}

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year.slice(-2)}`;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'checked in':
        return 'bg-blue-100 text-blue-800';
      case 'checked out':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // In managebooking.component.ts, update the printBooking method:
printBooking(): void {
  if (confirm('Print booking details?')) {
    const printContent = `
      <html>
        <head>
          <title>Booking Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            .receipt { max-width: 600px; margin: 0 auto; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .font-bold { font-weight: bold; }
            .border-t { border-top: 1px solid #ddd; padding-top: 16px; }
            .text-sm { font-size: 0.875rem; }
            .mb-4 { margin-bottom: 16px; }
            .mb-6 { margin-bottom: 24px; }
            .mt-8 { margin-top: 32px; }
            .p-6 { padding: 24px; }
          </style>
        </head>
        <body>
          <div class="receipt p-6">
            <h1 class="text-2xl font-bold mb-4">Booking Receipt</h1>
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p class="font-bold">Booking ID:</p>
                <p>${this.currentBooking.bookingId}</p>
              </div>
              <div>
                <p class="font-bold">Date:</p>
                <p>${this.formatDate(new Date().toISOString())}</p>
              </div>
              <div>
                <p class="font-bold">Customer:</p>
                <p>${this.currentBooking.customer}</p>
              </div>
              <div>
                <p class="font-bold">Room Type:</p>
                <p>${this.currentBooking.roomType}</p>
              </div>
              <div>
                <p class="font-bold">Room Number:</p>
                <p>${this.currentBooking.roomNumber}</p>
              </div>
              <div>
                <p class="font-bold">Check In:</p>
                <p>${this.formatDate(this.currentBooking.checkIn)}</p>
              </div>
              <div>
                <p class="font-bold">Check Out:</p>
                <p>${this.formatDate(this.currentBooking.checkOut)}</p>
              </div>
              <div>
                <p class="font-bold">Status:</p>
                <p>${this.currentBooking.status}</p>
              </div>
              <div>
                <p class="font-bold">Total Amount:</p>
                <p>₹${this.currentBooking.amount}</p>
              </div>
            </div>
            <div class="mt-8 pt-4 border-t">
              <p class="text-sm">Thank you for your booking!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  }
}
}