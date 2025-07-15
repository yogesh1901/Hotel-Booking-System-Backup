import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Customer {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  email: string;
  aadhar: string;
  address: string;
  photo:null;
  country: string;
  totalBooking: number;
  status: 'Block' | 'Unblock';
}

@Component({
  selector: 'app-managecustomer',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './managecustomer.component.html',
  styleUrls: ['./managecustomer.component.css']
})
export class ManagecustomerComponent implements OnInit {
  showSaveConfirmationModal: boolean = false;
  itemsPerPage = 5;
  currentPage = 1;
  filteredCustomers: Customer[] = [];
  showEditModal = false;
  showViewModal = false;
  showStatusModal = false;
  showDeleteModal = false;
  isEditMode = false;
  customerForm: FormGroup;
  
  selectedCustomer: Customer | null = null;
  toastMessage = '';
  showToast = false;
  customers: Customer[] = [];
  // apiUrl = 'https://68669d5b89803950dbb35bfc.mockapi.io/Data/customers';

  constructor(private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      id: [''], // Hidden field for edit mode
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      address: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchCustomers();
  }

  fetchCustomers() {
    const customersStr = localStorage.getItem('hotel_customers');
    if (customersStr) {
      this.customers = JSON.parse(customersStr);
      this.filteredCustomers = [...this.customers];
    } else {
      this.customers = [];
      this.filteredCustomers = [];
    }
  }

  getCustomersToShow(): Customer[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCustomers.slice(startIndex, endIndex);
  }

  updateResultsInfo(): string {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredCustomers.length);
    return `Showing ${startIndex} to ${endIndex} of ${this.filteredCustomers.length} results`;
  }

  performSearch(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredCustomers = [...this.customers];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredCustomers = this.customers.filter(customer => {
        return (
          customer.customerId.toLowerCase().includes(term) || 
          customer.name.toLowerCase().includes(term) || 
          customer.email.toLowerCase().includes(term) || 
          customer.phone.toLowerCase().includes(term) ||
          customer.status.toLowerCase().includes(term)
        );
      });
    }
    this.currentPage = 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
  }

  getPaginationRange(): { startPage: number, endPage: number, totalPages: number } {
    const totalPages = this.getTotalPages();
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return { startPage, endPage, totalPages };
  }

  getPageNumbers(start: number, end: number): number[] {
    return Array.from({length: end - start + 1}, (_, i) => start + i);
  }

  openEditCustomerModal(customer: Customer): void {
    this.selectedCustomer = customer;
    this.isEditMode = true;
    this.customerForm.patchValue({
      id: customer.id,
      email: customer.email,
      mobileNumber: customer.phone,
      address: customer.address,
      country: customer.country
    });
    this.showEditModal = true;
  }

  openViewCustomerModal(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showViewModal = true;
  }

  toggleCustomerStatus(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showStatusModal = true;
  }

  confirmStatusChange(): void {
    if (!this.selectedCustomer) return;
    const newStatus = this.selectedCustomer.status === 'Block' ? 'Unblock' : 'Block';
    this.selectedCustomer.status = newStatus;
    this.updateCustomerInLocalStorage(this.selectedCustomer);
    this.showToastMessage(`Customer status updated to ${newStatus}`);
    this.fetchCustomers();
    this.closeStatusModal();
  }

  openDeleteConfirmation(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.selectedCustomer) return;
    this.deleteCustomerFromLocalStorage(this.selectedCustomer.id);
    this.showToastMessage('Customer deleted successfully');
    this.fetchCustomers();
    this.closeDeleteModal();
  }

  openPrintModal(customer: Customer): void {
    this.selectedCustomer = customer;
    this.printCustomerDetails();
  }

  printCustomerDetails(): void {
    if (!this.selectedCustomer) return;
    
    const printContent = `
      <h2>Customer Details</h2>
      <p><strong>Customer ID:</strong> ${this.selectedCustomer.customerId}</p>
      <p><strong>Full Name:</strong> ${this.selectedCustomer.name}</p>
      <p><strong>Email:</strong> ${this.selectedCustomer.email}</p>
      <p><strong>Mobile Number:</strong> ${this.selectedCustomer.phone}</p>
      <p><strong>Aadhar Number:</strong> ${this.selectedCustomer.aadhar}</p>
      <p><strong>Address:</strong> ${this.selectedCustomer.address}</p>
      <p><strong>Country:</strong> ${this.selectedCustomer.country}</p>
      <p><strong>Total Bookings:</strong> ${this.selectedCustomer.totalBooking}</p>
      <p><strong>Status:</strong> ${this.selectedCustomer.status}</p>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Customer Details - ${this.selectedCustomer.customerId}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2 { color: #2d3748; border-bottom: 1px solid #eee; padding-bottom: 10px; }
              p { margin: 8px 0; }
              strong { font-weight: bold; width: 150px; display: inline-block; }
              @media print {
                body { font-size: 12pt; }
              }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 200);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  onSubmit(): void {
    if (this.customerForm.invalid || !this.selectedCustomer) return;
    const formData = this.customerForm.value;
    const updatedCustomer = {
      ...this.selectedCustomer,
      email: formData.email,
      phone: formData.mobileNumber,
      address: formData.address,
      country: formData.country
    };
    this.updateCustomerInLocalStorage(updatedCustomer);
    this.showToastMessage('Customer updated successfully!');
    this.fetchCustomers();
    this.closeEditModal();
  }

  updateCustomerInLocalStorage(customer: Customer) {
    const customersStr = localStorage.getItem('hotel_customers');
    let customers: Customer[] = customersStr ? JSON.parse(customersStr) : [];
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      customers[index] = customer;
    } else {
      customers.push(customer);
    }
    localStorage.setItem('hotel_customers', JSON.stringify(customers));
  }

  deleteCustomerFromLocalStorage(id: string) {
    const customersStr = localStorage.getItem('hotel_customers');
    let customers: Customer[] = customersStr ? JSON.parse(customersStr) : [];
    customers = customers.filter(c => c.id !== id);
    localStorage.setItem('hotel_customers', JSON.stringify(customers));
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.customerForm.reset();
    this.isEditMode = false;
  }

  closeViewModal(): void {
    this.showViewModal = false;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  showToastMessage(message: string, duration: number = 3000): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, duration);
  }
}