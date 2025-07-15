import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Room {
  roomNumber: string;
  type: string;
  name?: string;
  capacity: number;
  price: number;
  description?: string;
  image?: string;
  amenities?: string[];
  size?: string;
  status?: string;
  amenitiesString?: string;
}

@Component({
  selector: 'app-managerooms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './managerooms.component.html',
  styleUrls: ['./managerooms.component.css']
})
export class ManageroomsComponent implements OnInit {
  isMobileSidebarOpen = false;
  showAddEditModal = false;
  showDeleteConfirmationModal = false;
  showSaveConfirmationModal = false;
  roomToDelete: string | null = null;
  toastMessage = '';
  showToast = false;
  isEditMode = false;
  currentRoom: Room = {
    roomNumber: '',
    type: 'Standard',
    name: '',
    capacity: 1,
    price: 0,
    description: '',
    image: '',
    amenities: [],
    size: '',
    status: 'Available',
    amenitiesString: ''
  } as any;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  selectedRoom: Room | null = null;
  showRoomDetailsModal = false;
  showBookingHistoryModal = false;
  selectedRoomNumber: string = '';
  roomBookings: any[] = [];
  selectedBooking: any = null;
  showBookingDetailsModal = false;

  rooms: Room[] = [];

  ngOnInit() {
    this.loadRoomsFromLocalStorage();
    if (this.isEditMode && this.currentRoom.amenities) {
      this.currentRoom.amenitiesString = this.currentRoom.amenities.join(', ');
    }
  }

  loadRoomsFromLocalStorage() {
    const roomsStr = localStorage.getItem('hotel_rooms');
    if (roomsStr) {
      this.rooms = JSON.parse(roomsStr);
    } else {
      this.rooms = [];
    }
  }

  getRoomTypes(): string[] {
    const types = new Set<string>();
    this.filteredRooms.forEach(room => types.add(room.type));
    return Array.from(types);
  }

  getRoomsByType(type: string): Room[] {
    return this.filteredRooms.filter(room => room.type === type);
  }

  toggleRoomSelection(room: Room): void {
    this.selectedRoom = this.selectedRoom === room ? null : room;
  }

  openEditRoomModal(room: Room) {
    this.isEditMode = true;
    this.currentRoom = { ...room };
    this.currentRoom.amenitiesString = (room.amenities && Array.isArray(room.amenities)) ? room.amenities.join(', ') : '';
    this.showAddEditModal = true;
  }

  closeAddEditModal() {
    this.showAddEditModal = false;
  }

  openDeleteConfirmation(roomNumber: string) {
    this.roomToDelete = roomNumber;
    this.showDeleteConfirmationModal = true;
  }

  closeDeleteConfirmation() {
    this.roomToDelete = null;
    this.showDeleteConfirmationModal = false;
  }

  saveRoom() {
    if (this.isEditMode) {
      this.showSaveConfirmationModal = true;
    } else {
      this.confirmAddRoom();
    }
  }

  confirmAddRoom() {
    if (this.currentRoom.amenitiesString) {
      this.currentRoom.amenities = this.currentRoom.amenitiesString.split(',').map(a => a.trim()).filter(a => a);
    } else {
      this.currentRoom.amenities = [];
    }
    if (this.rooms.some(r => r.roomNumber === this.currentRoom.roomNumber)) {
      this.showToastMessage('Room with this number already exists!');
      return;
    }
    this.rooms.push({ ...this.currentRoom });
    localStorage.setItem('hotel_rooms', JSON.stringify(this.rooms));
    this.showToastMessage(`Room ${this.currentRoom.roomNumber} added successfully!`);
    this.closeAddEditModal();
    this.currentPage = 1;
  }

  confirmSaveChanges() {
    if (this.currentRoom.amenitiesString) {
      this.currentRoom.amenities = this.currentRoom.amenitiesString.split(',').map(a => a.trim()).filter(a => a);
    } else {
      this.currentRoom.amenities = [];
    }
    const index = this.rooms.findIndex(r => r.roomNumber === this.currentRoom.roomNumber);
    if (index !== -1) {
      this.rooms[index] = { ...this.currentRoom };
      localStorage.setItem('hotel_rooms', JSON.stringify(this.rooms));
      this.showToastMessage(`Room ${this.currentRoom.roomNumber} updated successfully!`);
    }
    this.showSaveConfirmationModal = false;
    this.closeAddEditModal();
    this.currentPage = 1;
  }

  cancelSaveChanges() {
    this.showSaveConfirmationModal = false;
  }

  deleteRoom(roomNumber: string) {
    this.openDeleteConfirmation(roomNumber);
  }

  confirmDelete() {
    if (this.roomToDelete) {
      this.rooms = this.rooms.filter(r => r.roomNumber !== this.roomToDelete);
      localStorage.setItem('hotel_rooms', JSON.stringify(this.rooms));
      this.showToastMessage(`Room ${this.roomToDelete} deleted successfully!`);
      if (this.paginatedRooms.length === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
    }
    this.closeDeleteConfirmation();
  }

  showToastMessage(message: string, duration: number = 3000) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, duration);
  }

  get filteredRooms(): Room[] {
    if (!this.searchTerm) {
      return this.rooms;
    }
    
    return this.rooms.filter(room => {
      return (
        room.roomNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (room.name && room.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        room.capacity.toString().includes(this.searchTerm) ||
        room.price.toString().includes(this.searchTerm)
      );
    });
  }

  get paginatedRooms(): Room[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredRooms.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRooms.length / this.itemsPerPage);
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getRoomAvailabilityStatus(room: Room): string {
    const bookingsStr = localStorage.getItem('hotel_bookings');
    if (!bookingsStr) return 'Available';
    const allBookings = JSON.parse(bookingsStr);
    const today = new Date();
    const isOccupied = allBookings.some((booking: any) => {
      let bookingRoomNumber = '';
      if (booking.room && typeof booking.room === 'object' && 'roomNumber' in booking.room) {
        bookingRoomNumber = booking.room.roomNumber;
      } else if (booking.roomNumber) {
        bookingRoomNumber = booking.roomNumber;
      }
      if (bookingRoomNumber !== room.roomNumber) return false;
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      return (
        (booking.status === 'confirmed' || booking.status === 'active' ) &&
        today >= checkIn && today < checkOut
      );
    });
    return isOccupied ? 'Occupied' : 'Available';
  }

  viewRoomDetails(room: Room) {
    const roomsStr = localStorage.getItem('hotel_rooms');
    if (roomsStr) {
      const allRooms: Room[] = JSON.parse(roomsStr);
      this.selectedRoom = allRooms.find(r => r.roomNumber === room.roomNumber) || null;
    } else {
      this.selectedRoom = null;
    }
    this.showRoomDetailsModal = true;
  }

  closeRoomDetailsModal() {
    this.selectedRoom = null;
    this.showRoomDetailsModal = false;
  }

  openBookingHistoryModal(room: Room) {
    this.selectedRoomNumber = room.roomNumber;
    const bookingsStr = localStorage.getItem('hotel_bookings');
    if (bookingsStr) {
      const allBookings = JSON.parse(bookingsStr);
      this.roomBookings = allBookings.filter((booking: any) => {
        let bookingRoomNumber = '';
        if (booking.room && typeof booking.room === 'object' && 'roomNumber' in booking.room) {
          bookingRoomNumber = booking.room.roomNumber;
        } else if (booking.roomNumber) {
          bookingRoomNumber = booking.roomNumber;
        }
        return bookingRoomNumber === room.roomNumber;
      }).map((booking: any) => {
        let price = booking.price;
        if (!price && booking.room && booking.room.price) {
          price = booking.room.price;
        }
        return { ...booking, price };
      });
    } else {
      this.roomBookings = [];
    }
    this.showBookingHistoryModal = true;
  }

  closeBookingHistoryModal() {
    this.selectedRoomNumber = '';
    this.roomBookings = [];
    this.showBookingHistoryModal = false;
  }

  openBookingDetailsModal(booking: any) {
    let guestName = booking.guestInfo?.name || booking.guest?.name || booking.guestName || booking.customerName || '-';
    let guestEmail = booking.guestInfo?.email || booking.guest?.email || booking.email || '-';
    let guestPhone = booking.guestInfo?.phone || booking.guest?.phone || booking.phone || '-';
    let guestAadhar = booking.guestInfo?.aadhar || '-';
    let paymentMethod = booking.paymentInfo?.method || booking.payment?.method || booking.paymentMethod || booking.method || '-';
    let paymentStatus = booking.paymentInfo?.status || booking.payment?.status || booking.paymentStatus || '-';
    let amountPaid = booking.paymentInfo?.amount || booking.payment?.amount || booking.price || (booking.room && booking.room.price) || '-';
    let creditCard = booking.paymentInfo?.creditCard || booking.payment?.creditCard || null;
    let paypal = booking.paymentInfo?.paypal || booking.payment?.paypal || null;
    let bankTransfer = booking.paymentInfo?.bankTransfer || booking.payment?.bankTransfer || null;
    let upi = booking.paymentInfo?.upi || booking.payment?.upi || null;
    this.selectedBooking = {
      ...booking,
      guestName,
      guestEmail,
      guestPhone,
      guestAadhar,
      paymentMethod,
      paymentStatus,
      amountPaid,
      creditCard,
      paypal,
      bankTransfer,
      upi
    };
    this.showBookingDetailsModal = true;
  }

  closeBookingDetailsModal() {
    this.selectedBooking = null;
    this.showBookingDetailsModal = false;
  }

  getCustomerDetail(bookingId: string, field: string): string {
    const bookingsStr = localStorage.getItem('hotel_bookings');
    if (!bookingsStr) return '-';
    const allBookings = JSON.parse(bookingsStr);
    const booking = allBookings.find((b: any) => b.id === bookingId || b.reference === bookingId);
    if (!booking) return '-';
    if (booking.guestInfo && booking.guestInfo[field]) return booking.guestInfo[field];
    if (booking.guest && booking.guest[field]) return booking.guest[field];
    if (booking[field]) return booking[field];
    return '-';
  }
}