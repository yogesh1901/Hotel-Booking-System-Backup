import { Routes } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './auth/Components/login/login.component';
import { ContactComponent } from './Contact/Components/contact/contact.component';
import { ForgotPasswordComponent } from './auth/Components/forget-password/forget-password.component';
import { SignupComponent } from './auth/Components/signup/signup.component';
import { ResetPageComponent } from './auth/Components/reset-page/reset-page.component';
import { FeedbackComponent } from './Contact/Components/feedback/feedback.component';
import { MapComponent } from './Contact/Components/map/map.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { CustomerLayoutComponent } from './customer/customer-layout/customer-layout.component';
import { RoombookingComponent } from './booking/component/roombooking/roombooking.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'login', 
    component: LoginComponent, 
    title: 'Login',
    canActivate: [AuthGuard],
    data: { isLoginPage: true } 
  },
  { path: 'contact', component: ContactComponent, title: 'Contact' },
  { path: 'feedback', component: FeedbackComponent, title: 'Feedback' },
  { path: 'map', component: MapComponent, title: 'Map' },
  { 
    path: 'signup', 
    component: SignupComponent, 
    title: 'Signup',
    canActivate: [AuthGuard],
    data: { isLoginPage: true }
  },
  { 
    path: 'forgot-password', 
    component: ForgotPasswordComponent, 
    title: 'Forgot Password',
    canActivate: [AuthGuard],
    data: { isLoginPage: true }
  },
  { 
    path: 'reset-page', 
    component: ResetPageComponent, 
    title: 'Reset Password',
    canActivate: [AuthGuard],
    data: { isLoginPage: true }
  },
  {
    path: 'room-booking',
    component: RoombookingComponent,
    title: 'Room Booking'
  },
  {
    path: 'booking-form',
    loadComponent: () => import('./booking/component/booking-form/booking-form.component').then(m => m.BookingFormComponent),
    title: 'Booking Form'
  },
  {
    path: 'confirm-booking',
    loadComponent: () => import('./booking/component/confirm-booking/confirm-booking.component').then(m => m.ConfirmBookingComponent),
    title: 'Booking Confirmation'
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./booking/component/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
    title: 'Privacy Policy'
  },
  {
    path: 'terms-and-conditions',
    loadComponent: () => import('./booking/component/terms-and-condition/terms-and-condition.component').then(m => m.TermsAndConditionComponent),
    title: 'Terms and Conditions'
  },
  // Admin routes with layout
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' },
    children: [
      { path: 'dashboard', loadComponent: () => import('./admin/components/dashboard/dashboard.component').then(m => m.DashboardComponent), title: 'Dashboard' },
      { path: 'managebooking', loadComponent: () => import('./admin/components/managebooking/managebooking.component').then(m => m.ManagebookingComponent), title: 'Manage Booking' },
      { path: 'managerooms', loadComponent: () => import('./admin/components/managerooms/managerooms.component').then(m => m.ManageroomsComponent), title: 'Manage Rooms' },
      { path: 'managecustomer', loadComponent: () => import('./admin/components/managecustomer/managecustomer.component').then(m => m.ManagecustomerComponent), title: 'Manage Customer' },
      { path: 'managefeedback', loadComponent: () => import('./admin/components/managefeedback/managefeedback.component').then(m => m.ManagefeedbackComponent), title: 'Manage Feedback' },
      { path: 'managereport', loadComponent: () => import('./admin/components/managereport/managereport.component').then(m => m.ManagereportComponent), title: 'Manage Report' },
      { path: 'managecontent', loadComponent: () => import('./admin/components/managecontent/managecontent.component').then(m => m.ManagecontentComponent), title: 'Manage Content' },
      { path: 'adminprofile', loadComponent: () => import('./admin/components/adminprofile/adminprofile.component').then(m => m.AdminprofileComponent), title: 'Admin Profile' },
      { path: 'settings', loadComponent: () => import('./admin/components/settings/settings.component').then(m => m.SettingsComponent), title: 'Settings' },
      { path: 'helpcenter', loadComponent: () => import('./admin/components/help-center/help-center.component').then(m => m.HelpCenterComponent) },
    ]
  },
  // Customer routes with layout
  {
    path: '',
    component: CustomerLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'user' },
    children: [
      { path: 'user-dashboard', loadComponent: () => import('./customer/components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent), title: 'Dashboard' },
      { path: 'user-profile', loadComponent: () => import('./customer/components/customer-profile/customer-profile.component').then(m => m.CustomerProfileComponent), title: 'Profile' },
      { path: 'user-bookings', loadComponent: () => import('./customer/components/customer-booking/customer-booking.component').then(m => m.CustomerBookingComponent), title: 'My Bookings' },
      { path: 'user-payment-history', loadComponent: () => import('./customer/components/customer-payment-history/customer-payment-history.component').then(m => m.CustomerPaymentHistoryComponent) },
      { path: 'user-feedback', loadComponent: () => import('./customer/components/customer-feedback/customer-feedback.component').then(m => m.CustomerFeedbackComponent) },
      { path: 'user-settings', loadComponent: () => import('./customer/components/customer-settings/customer-settings.component').then(m => m.CustomerSettingsComponent) }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];