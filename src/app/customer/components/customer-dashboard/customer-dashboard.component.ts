import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, NgApexchartsModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent {
  // Chart visibility controls
  showBookingsChart: boolean = true;
  showSavingsChart: boolean = false;

  // Hotel information
  hotelInfo = {
    name: 'Grand Paradise Resort',
    location: 'Goa',
    rating: 4.8,
    image: 'assets/hotel-image.jpg',
    upcomingStay: {
      date: '2023-12-15',
      nights: 5,
      roomType: 'Deluxe Sea View'
    }
  };

  // Bookings chart
  public bookingsChartOptions: any = {
    series: [{
      name: 'Your Visits',
      data: [1, 0, 2, 1, 3, 0, 2]
    }],
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#10B981'],
    stroke: { 
      width: 4,
      curve: 'smooth',
      colors: ['#10B981']
    },
    markers: { 
      size: 6,
      colors: ['#10B981'],
      strokeColors: '#fff',
      strokeWidth: 2
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    yaxis: {
      title: { text: 'Number of Visits' },
      min: 0,
      max: 5
    }
  };

  // Savings chart
  public savingsChartOptions: any = {
    series: [{
      name: 'Your Savings',
      data: [1200, 0, 2500, 1800, 3100, 0, 2200]
    }],
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#4CAF50'],
    stroke: {
      width: 4,
      colors: ['#4CAF50']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    yaxis: {
      title: { text: 'Savings (₹)' },
      labels: {
        formatter: (value: number) => '₹' + value.toLocaleString('en-IN')
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => '₹' + value.toLocaleString('en-IN')
      }
    }
  };

  // Booking history data
  bookingHistory = [
    { 
      bookingId: 'BK1001', 
      checkIn: '2023-07-15', 
      checkOut: '2023-07-20', 
      guests: 2, 
      amount: 18000,
      originalPrice: 20000,
      savings: 2000,
      roomType: 'Deluxe Sea View'
    },
    { 
      bookingId: 'BK1002', 
      checkIn: '2023-05-10', 
      checkOut: '2023-05-15', 
      guests: 2, 
      amount: 15000,
      originalPrice: 16500,
      savings: 1500,
      roomType: 'Premium Room'
    },
    { 
      bookingId: 'BK1003', 
      checkIn: '2023-03-22', 
      checkOut: '2023-03-25', 
      guests: 2, 
      amount: 9000,
      originalPrice: 10000,
      savings: 1000,
      roomType: 'Premium Room'
    }
  ];

  // Summary data
  totalAmountSpent = 42000;
  upcomingTrips = 1;
  totalBookings = 3;
  yearlyBookings = 9; // Added new property for yearly bookings
  totalSavings = 4500;
  loyaltyDiscounts = 1500;

  // Loyalty program data
  loyaltyStatus = {
    currentTier: 'Silver',
    nextTier: 'Gold',
    progress: 65,
    staysToNextTier: 2,
    benefits: ['Room upgrade', 'Late checkout', 'Welcome drinks']
  };

  // Calculate projected annual savings
  get projectedAnnualSavings(): string {
    const currentMonth = new Date().getMonth() + 1;
    const projected = (this.totalSavings / currentMonth) * 12;
    return projected.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  // Get loyalty upgrade info
  get loyaltyUpgradeInfo() {
    const needed = 50000 - this.totalAmountSpent;
    return {
      needed: needed > 0 ? needed : 0,
      benefits: needed <= 0 ? 'You qualify for Gold tier!' : 
               `Book 4 more stays for Gold tier`
    };
  }

  // Calculate days until next stay
  daysUntilNextStay(): number {
    const nextStayDate = new Date(this.hotelInfo.upcomingStay.date);
    const today = new Date();
    const diff = nextStayDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}