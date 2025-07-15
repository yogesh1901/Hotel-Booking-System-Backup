// customer-payment-history.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-payment-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-payment-history.component.html',
  styleUrls: ['./customer-payment-history.component.css']
})
export class CustomerPaymentHistoryComponent {
  payments = [
    {
      id: 'TXN789456',
      amount: '₹12,500',
      date: '10 Apr 2025',
      status: 'Success'
    },
    {
      id: 'TXN123456',
      amount: '₹8,400',
      date: '5 Mar 2025',
      status: 'Success'
    }
  ];
}