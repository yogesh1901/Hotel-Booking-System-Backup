import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  bookings = [
    {
      id: 12,
      customer: 'Yogesh',
      room: 'Suite',
      checkIn: '25-03-25',
      checkOut: '25-03-25',
      status: 'Confirmed'
    },
    {
      id: 11,
      customer: 'Rahul',
      room: 'Deluxe',
      checkIn: '24-03-25',
      checkOut: '26-03-25',
      status: 'Confirmed'
    },
    {
      id: 10,
      customer: 'Priya',
      room: 'Standard',
      checkIn: '23-03-25',
      checkOut: '25-03-25',
      status: 'Pending'
    }
  ];

  currentBooking: any = null;
  showViewModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showSuccessNotification = false;
  notificationMessage = '';

  ngOnInit(): void {
    this.createRevenueChart();
    this.createOccupancyChart();
  }

  createRevenueChart() {
  const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue (in ₹)',
        data: [45000, 48000, 52000, 58000, 62000, 65000],
        backgroundColor: 'rgba(65, 71, 63, 0.8)', // Matching your card gradient
        borderColor: 'rgba(65, 71, 63, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return '₹' + (context.raw as number).toLocaleString();
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₹' + value.toLocaleString();
            },
            font: {
              size: 12
            }
          }
        },
        x: {
          ticks: {
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

createOccupancyChart() {
  const ctx = document.getElementById('occupancyChart') as HTMLCanvasElement;
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Occupied', 'Available'],
      datasets: [{
        data: [87, 13],
        backgroundColor: [
          'rgba(144, 173, 135, 0.8)', // Matching your card gradient
          'rgba(215, 155, 43, 0.8)'    // Matching your container gradient
        ],
        borderColor: [
          'rgba(144, 173, 135, 1)',
          'rgba(215, 155, 43, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ' + (context.raw as number) + '%';
            }
          }
        }
      },
      cutout: '65%' // Makes the doughnut hole smaller
    }
  });
}

  openModal(type: string, booking: any = null) {
    this.currentBooking = booking;
    
    if (type === 'view') {
      this.showViewModal = true;
    } else if (type === 'edit') {
      this.showEditModal = true;
    } else if (type === 'delete') {
      this.showDeleteModal = true;
    }
  }

  closeModal() {
    this.showViewModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.currentBooking = null;
  }

  confirmDelete() {
    if (this.currentBooking) {
      this.bookings = this.bookings.filter(b => b.id !== this.currentBooking.id);
      this.showNotification('Booking deleted successfully!');
    }
    this.closeModal();
  }

  updateBooking(updatedBooking: any) {
    const index = this.bookings.findIndex(b => b.id === updatedBooking.id);
    if (index !== -1) {
      this.bookings[index] = updatedBooking;
      this.showNotification('Booking updated successfully!');
    }
    this.closeModal();
  }

  showNotification(message: string) {
    this.notificationMessage = message;
    this.showSuccessNotification = true;
    
    setTimeout(() => {
      this.showSuccessNotification = false;
    }, 3000);
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}