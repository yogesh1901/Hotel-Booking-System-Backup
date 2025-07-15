import { Routes } from '@angular/router';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';
export const customerRoutes: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      { path: '', redirectTo: 'user-dashboard', pathMatch: 'full' },
      { path: 'user-dashboard', loadComponent: () => import('./components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent) },
      { path: 'user-profile', loadComponent: () => import('./components/customer-profile/customer-profile.component').then(m => m.CustomerProfileComponent) },
      { path: 'user-bookings', loadComponent: () => import('./components/customer-booking/customer-booking.component').then(m => m.CustomerBookingComponent) },
      { path: 'user-payment-history', loadComponent: () => import('./components/customer-payment-history/customer-payment-history.component').then(m => m.CustomerPaymentHistoryComponent) },
      { path: 'user-feedback', loadComponent: () => import('./components/customer-feedback/customer-feedback.component').then(m => m.CustomerFeedbackComponent) },
      { path: 'user-settings', loadComponent: () => import('./components/customer-settings/customer-settings.component').then(m => m.CustomerSettingsComponent) }
    ]
  }
];