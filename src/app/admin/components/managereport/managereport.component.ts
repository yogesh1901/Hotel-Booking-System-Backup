import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


interface Report {
  id: string;
  type: string;
  dateRange: string;
  generated: string;
  content: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  bookings: number;
}

interface HotelDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  rooms: number;
  rating: string;
}

@Component({
  selector: 'app-managereport',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './managereport.component.html',
  styleUrls: ['./managereport.component.css']
})
export class ManagereportComponent {
  reports: { [key: string]: Report } = {
    'R101': {
      id: 'R101',
      type: 'Financial Report',
      dateRange: '01-03-2025 to 31-03-2025',
      generated: '25-03-2025',
      content: `
        <div class="report-content">
          <h3 class="text-lg font-bold mb-4">Financial Summary - March 2025</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <h4 class="font-semibold text-green-800 mb-2">Revenue</h4>
              <p class="text-2xl font-bold text-green-600">$85,420</p>
              <p class="text-sm text-green-700">+12% from last month</p>
            </div>
            <div class="bg-red-50 p-4 rounded-lg">
              <h4 class="font-semibold text-red-800 mb-2">Expenses</h4>
              <p class="text-2xl font-bold text-red-600">$42,150</p>
              <p class="text-sm text-red-700">+5% from last month</p>
            </div>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-blue-800 mb-2">Net Profit</h4>
            <p class="text-3xl font-bold text-blue-600">$43,270</p>
            <p class="text-sm text-blue-700">+18% from last month</p>
          </div>
          <div class="mb-4">
            <h4 class="font-semibold mb-2">Revenue Breakdown</h4>
            <ul class="space-y-2">
              <li class="flex justify-between"><span>Room Bookings:</span> <span>$68,340</span></li>
              <li class="flex justify-between"><span>Restaurant:</span> <span>$12,450</span></li>
              <li class="flex justify-between"><span>Spa Services:</span> <span>$4,630</span></li>
            </ul>
          </div>
        </div>
      `
    },
    'R102': {
      id: 'R102',
      type: 'Occupancy Report',
      dateRange: '01-03-2025 to 31-03-2025',
      generated: '20-03-2025',
      content: `
        <div class="report-content">
          <h3 class="text-lg font-bold mb-4">Occupancy Summary - March 2025</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-indigo-50 p-4 rounded-lg">
              <h4 class="font-semibold text-indigo-800 mb-2">Total Rooms</h4>
              <p class="text-2xl font-bold text-indigo-600">120</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <h4 class="font-semibold text-purple-800 mb-2">Occupancy Rate</h4>
              <p class="text-2xl font-bold text-purple-600">81.67%</p>
              <p class="text-sm text-purple-700">+3.2% from last month</p>
            </div>
          </div>
          <div class="mb-6">
            <h4 class="font-semibold mb-2">Room Type Breakdown</h4>
            <ul class="space-y-2">
              <li class="flex justify-between"><span>Standard Rooms:</span> <span>92% occupied</span></li>
              <li class="flex justify-between"><span>Deluxe Rooms:</span> <span>78% occupied</span></li>
              <li class="flex justify-between"><span>Suites:</span> <span>65% occupied</span></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-2">Peak Days</h4>
            <p>Highest occupancy on March 15 (98%) during the Business Conference event.</p>
          </div>
        </div>
      `
    },
    'R103': {
      id: 'R103',
      type: 'Customer Feedback Report',
      dateRange: '01-03-2025 to 31-03-2025',
      generated: '15-03-2025',
      content: `
        <div class="report-content">
          <h3 class="text-lg font-bold mb-4">Customer Feedback - March 2025</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h4 class="font-semibold text-yellow-800 mb-2">Average Rating</h4>
              <div class="flex items-center">
                <span class="text-2xl font-bold text-yellow-600 mr-2">4.5</span>
                <div class="flex">
                  <i class="fas fa-star text-yellow-400"></i>
                  <i class="fas fa-star text-yellow-400"></i>
                  <i class="fas fa-star text-yellow-400"></i>
                  <i class="fas fa-star text-yellow-400"></i>
                  <i class="fas fa-star-half-alt text-yellow-400"></i>
                </div>
              </div>
              <p class="text-sm text-yellow-700">out of 5.0</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-blue-800 mb-2">Feedback Count</h4>
              <p class="text-2xl font-bold text-blue-600">142</p>
              <p class="text-sm text-blue-700">responses</p>
            </div>
          </div>
          <div class="mb-6">
            <h4 class="font-semibold mb-2">Feedback Sentiment</h4>
            <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div class="bg-green-600 h-4 rounded-full" style="width: 87%"></div>
            </div>
            <div class="flex justify-between text-sm">
              <span>Positive: 87%</span>
              <span>Negative: 13%</span>
            </div>
          </div>
        </div>
      `
    }
  };
  customers: { [key: string]: Customer } = {
    'C101': { name: 'John Smith', email: 'john.smith@example.com', phone: '+1 555-123-4567', bookings: 3 },
    'C102': { name: 'Emma Johnson', email: 'emma.j@example.com', phone: '+1 555-987-6543', bookings: 5 },
    'C103': { name: 'Michael Brown', email: 'michael.b@example.com', phone: '+1 555-456-7890', bookings: 2 }
  };
  hotelDetails: HotelDetails = {
    name: 'Grand Horizon Hotel',
    address: '123 Ocean View Boulevard, Miami, FL 33139',
    phone: '+1 305-555-1234',
    email: 'info@grandhorizon.com',
    rooms: 120,
    rating: '4.8'
  };
  showGenerateReportModal = false;
  showViewReportModal = false;
  currentReport: Report | null = null;
  searchTerm = '';
  visibleCount = 3;
  notificationType: 'success' | 'error' | 'warning' | null = null;
  notificationMessage: string | null = null;

  // Filter and pagination properties
  activeFilter: 'all' | 'customer' | 'hotel' = 'all';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  // Report form and available types
  reportForm = {
    reportCategory: '',
    reportType: '',
    startDate: '',
    endDate: '',
    reportFormat: 'PDF'
  };
  availableReportTypes: {value: string, label: string}[] = [];

  constructor() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.reportForm.startDate = this.formatDateForInput(firstDayOfMonth);
    this.reportForm.endDate = this.formatDateForInput(today);
  }

  setFilter(filterType: 'all' | 'customer' | 'hotel') {
    this.activeFilter = filterType;
    this.currentPage = 1;
  }

  updateReportTypes() {
    switch(this.reportForm.reportCategory) {
      case 'financial':
        this.availableReportTypes = [
          {value: 'financial-summary', label: 'Financial Summary'},
          {value: 'revenue-analysis', label: 'Revenue Analysis'},
          {value: 'expense-breakdown', label: 'Expense Breakdown'},
          {value: 'profit-loss', label: 'Profit & Loss Statement'}
        ];
        break;
      case 'operational':
        this.availableReportTypes = [
          {value: 'occupancy', label: 'Occupancy Report'},
          {value: 'room-utilization', label: 'Room Utilization'},
          {value: 'staff-performance', label: 'Staff Performance'},
          {value: 'maintenance', label: 'Maintenance Logs'}
        ];
        break;
      case 'customer':
        this.availableReportTypes = [
          {value: 'feedback', label: 'Customer Feedback'},
          {value: 'satisfaction', label: 'Satisfaction Survey'},
          {value: 'loyalty', label: 'Loyalty Program'},
          {value: 'complaints', label: 'Complaint Analysis'}
        ];
        break;
      case 'marketing':
        this.availableReportTypes = [
          {value: 'campaign', label: 'Marketing Campaign'},
          {value: 'conversion', label: 'Conversion Rates'},
          {value: 'channel', label: 'Channel Performance'},
          {value: 'promotion', label: 'Promotion Effectiveness'}
        ];
        break;
      default:
        this.availableReportTypes = [];
    }
    this.reportForm.reportType = '';
  }

  toggleGenerateReportModal() {
    this.showGenerateReportModal = !this.showGenerateReportModal;
  }

  toggleViewReportModal(reportId?: string) {
    if (reportId) {
      this.currentReport = this.reports[reportId];
    }
    this.showViewReportModal = !this.showViewReportModal;
  }

  viewReport(reportId: string) {
    this.currentReport = this.reports[reportId];
    this.showViewReportModal = true;
  }

  downloadReport(reportId: string) {
    const report = this.reports[reportId];
    if (report) {
      const blob = new Blob([`Report ID: ${report.id}\nType: ${report.type}\nDate Range: ${report.dateRange}\nGenerated: ${report.generated}\n\nContent:\n${report.content.replace(/<[^>]*>/g, '')}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.type.replace(/\s+/g, '_')}_${reportId}.txt`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      this.showNotification(`Downloading ${report.type} (${reportId})...`, 'success');
    } else {
      this.showNotification('Report not found!', 'error');
    }
  }

  deleteReport(reportId: string) {
    const report = this.reports[reportId];
    if (report && confirm(`Are you sure you want to delete ${report.type} (${reportId})? This action cannot be undone.`)) {
      delete this.reports[reportId];
      this.showNotification(`${report.type} has been deleted successfully!`, 'success');
    }
  }

  printReport(reportId: string) {
    const report = this.reports[reportId];
    if (report) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${report['type']}</title>
              <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @page { size: auto; margin: 10mm; }
              </style>
            </head>
            <body class="p-6">
              <div class="report-header border-b-2 border-gray-200 pb-4 mb-4">
                <h1 class="text-2xl font-bold text-gray-800">${report['type']}</h1>
                <div class="flex justify-between mt-2 text-sm text-gray-600">
                  <p><strong>Date Range:</strong> ${report['dateRange']}</p>
                  <p><strong>Generated On:</strong> ${report['generated']}</p>
                </div>
              </div>
              ${report['content']}
              <div class="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
                Printed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
              </div>
              <script>
                setTimeout(() => {
                  window.print();
                  setTimeout(() => { window.close(); }, 500);
                }, 200);
              <\/script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  }

  generateReport() {
    if (!this.reportForm.reportType || !this.reportForm.startDate || !this.reportForm.endDate) {
      this.showNotification('Please fill all required fields!', 'error');
      return;
    }
    if (new Date(this.reportForm.startDate) > new Date(this.reportForm.endDate)) {
      this.showNotification('End date must be after start date!', 'error');
      return;
    }
    this.showNotification(`Generating ${this.reportForm.reportType} Report for ${this.reportForm.startDate} to ${this.reportForm.endDate} in ${this.reportForm.reportFormat} format...`, 'success');
    setTimeout(() => {
      const newReportId = 'R' + (Math.floor(Math.random() * 900) + 100);
      const formattedStart = this.formatDate(new Date(this.reportForm.startDate));
      const formattedEnd = this.formatDate(new Date(this.reportForm.endDate));
      this.reports[newReportId] = {
        id: newReportId,
        type: `${this.reportForm.reportType} Report`,
        dateRange: `${formattedStart} to ${formattedEnd}`,
        generated: this.formatDate(new Date()),
        content: this.generateReportContent(this.reportForm.reportType, this.reportForm.startDate, this.reportForm.endDate)
      };
      this.showNotification('Report generated successfully!', 'success');
      this.toggleGenerateReportModal();
    }, 1500);
  }

  generateReportContent(type: string, startDate: string, endDate: string): string {
    const formattedStart = this.formatDate(new Date(startDate));
    const formattedEnd = this.formatDate(new Date(endDate));
    
    const customerDetailsHTML = `
      <div class="mt-6 border-t pt-4">
        <h4 class="font-semibold mb-2">Customer Details (Selected Period)</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${Object.entries(this.customers).map(([id, customer]) => `
            <div class="bg-gray-50 p-3 rounded-lg">
              <h5 class="font-medium">${customer.name}</h5>
              <p class="text-sm">Email: ${customer.email}</p>
              <p class="text-sm">Phone: ${customer.phone}</p>
              <p class="text-sm">Bookings: ${customer.bookings}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    const hotelDetailsHTML = `
      <div class="mt-6 border-t pt-4">
        <h4 class="font-semibold mb-2">Hotel Details</h4>
        <div class="bg-gray-50 p-3 rounded-lg">
          <h5 class="font-medium">${this.hotelDetails.name}</h5>
          <p class="text-sm">Address: ${this.hotelDetails.address}</p>
          <p class="text-sm">Phone: ${this.hotelDetails.phone}</p>
          <p class="text-sm">Email: ${this.hotelDetails.email}</p>
          <p class="text-sm">Total Rooms: ${this.hotelDetails.rooms}</p>
          <p class="text-sm">Rating: ${this.hotelDetails.rating}/5</p>
        </div>
      </div>
    `;
    
    switch(type.toLowerCase()) {
      case 'financial':
        return `
          <div class="report-content">
            <h3 class="text-lg font-bold mb-4">Financial Summary - ${formattedStart} to ${formattedEnd}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-semibold text-green-800 mb-2">Revenue</h4>
                <p class="text-2xl font-bold text-green-600">$${Math.floor(Math.random() * 50000) + 50000}</p>
              </div>
              <div class="bg-red-50 p-4 rounded-lg">
                <h4 class="font-semibold text-red-800 mb-2">Expenses</h4>
                <p class="text-2xl font-bold text-red-600">$${Math.floor(Math.random() * 30000) + 20000}</p>
              </div>
            </div>
            <div class="mb-4">
              <h4 class="font-semibold mb-2">Revenue Breakdown</h4>
              <ul class="space-y-2">
                <li class="flex justify-between"><span>Room Bookings:</span> <span>$${Math.floor(Math.random() * 40000) + 30000}</span></li>
                <li class="flex justify-between"><span>Restaurant:</span> <span>$${Math.floor(Math.random() * 15000) + 5000}</span></li>
                <li class="flex justify-between"><span>Spa Services:</span> <span>$${Math.floor(Math.random() * 8000) + 2000}</span></li>
              </ul>
            </div>
            ${customerDetailsHTML}
            ${hotelDetailsHTML}
          </div>
        `;
      case 'occupancy':
        return `
          <div class="report-content">
            <h3 class="text-lg font-bold mb-4">Occupancy Summary - ${formattedStart} to ${formattedEnd}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="bg-indigo-50 p-4 rounded-lg">
                <h4 class="font-semibold text-indigo-800 mb-2">Total Rooms</h4>
                <p class="text-2xl font-bold text-indigo-600">120</p>
              </div>
              <div class="bg-purple-50 p-4 rounded-lg">
                <h4 class="font-semibold text-purple-800 mb-2">Occupancy Rate</h4>
                <p class="text-2xl font-bold text-purple-600">${Math.floor(Math.random() * 30) + 60}%</p>
              </div>
            </div>
            <div class="mb-6">
              <h4 class="font-semibold mb-2">Room Type Breakdown</h4>
              <ul class="space-y-2">
                <li class="flex justify-between"><span>Standard Rooms:</span> <span>${Math.floor(Math.random() * 20) + 80}% occupied</span></li>
                <li class="flex justify-between"><span>Deluxe Rooms:</span> <span>${Math.floor(Math.random() * 30) + 60}% occupied</span></li>
                <li class="flex justify-between"><span>Suites:</span> <span>${Math.floor(Math.random() * 30) + 50}% occupied</span></li>
              </ul>
            </div>
            ${customerDetailsHTML}
            ${hotelDetailsHTML}
          </div>
        `;
      case 'feedback':
        return `
          <div class="report-content">
            <h3 class="text-lg font-bold mb-4">Customer Feedback - ${formattedStart} to ${formattedEnd}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="bg-yellow-50 p-4 rounded-lg">
                <h4 class="font-semibold text-yellow-800 mb-2">Average Rating</h4>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-yellow-600 mr-2">${(Math.random() * 1 + 4).toFixed(1)}</span>
                  <div class="flex">
                    <i class="fas fa-star text-yellow-400"></i>
                    <i class="fas fa-star text-yellow-400"></i>
                    <i class="fas fa-star text-yellow-400"></i>
                    <i class="fas fa-star text-yellow-400"></i>
                    <i class="fas fa-star-half-alt text-yellow-400"></i>
                  </div>
                </div>
                <p class="text-sm text-yellow-700">out of 5.0</p>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-semibold text-blue-800 mb-2">Feedback Count</h4>
                <p class="text-2xl font-bold text-blue-600">${Math.floor(Math.random() * 100) + 50}</p>
                <p class="text-sm text-blue-700">responses</p>
              </div>
            </div>
            ${customerDetailsHTML}
            ${hotelDetailsHTML}
          </div>
        `;
      default:
        return `
          <div class="report-content">
            <h3 class="text-lg font-bold mb-4">${type} Report - ${formattedStart} to ${formattedEnd}</h3>
            <p>This is a newly generated ${type.toLowerCase()} report covering the period from ${formattedStart} to ${formattedEnd}.</p>
            ${customerDetailsHTML}
            ${hotelDetailsHTML}
          </div>
        `;
    }
  }

  getReportTypeClass(type: string): string {
    switch(type.toLowerCase()) {
      case 'financial': return 'financial-report';
      case 'occupancy': return 'occupancy-report';
      case 'feedback': return 'feedback-report';
      default: return 'financial-report';
    }
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  showNotification(message: string, type: 'success' | 'error' | 'warning') {
    this.notificationType = type;
    this.notificationMessage = message;
    setTimeout(() => {
      this.notificationMessage = null;
      this.notificationType = null;
    }, 3000);
  }

  get filteredReports() {
    const searchTerm = this.searchTerm.toLowerCase();
    const filtered = Object.values(this.reports)
      .filter(report => {
        // Search filter
        const matchesSearch =
          report.id.toLowerCase().includes(searchTerm) ||
          report.type.toLowerCase().includes(searchTerm) ||
          report.dateRange.toLowerCase().includes(searchTerm);
        // Type filter
        let matchesType = true;
        if (this.activeFilter === 'customer') {
          matchesType = report.type.toLowerCase().includes('feedback') ||
                        report.type.toLowerCase().includes('customer');
        } else if (this.activeFilter === 'hotel') {
          matchesType = report.type.toLowerCase().includes('financial') ||
                        report.type.toLowerCase().includes('occupancy') ||
                        report.type.toLowerCase().includes('revenue');
        }
        return matchesSearch && matchesType;
      });
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage) || 1;
    return filtered.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onSearchInput() {
    this.visibleCount = 3; // Reset visible count when searching
  }
}