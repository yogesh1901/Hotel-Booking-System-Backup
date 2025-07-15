import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'managebooking', loadComponent: () => import('./components/managebooking/managebooking.component').then(m => m.ManagebookingComponent) },
      { path: 'managerooms', loadComponent: () => import('./components/managerooms/managerooms.component').then(m => m.ManageroomsComponent) },
      { path: 'managecustomer', loadComponent: () => import('./components/managecustomer/managecustomer.component').then(m => m.ManagecustomerComponent) },
      { path: 'managefeedback', loadComponent: () => import('./components/managefeedback/managefeedback.component').then(m => m.ManagefeedbackComponent) },
      { path: 'managecontent', loadComponent: () => import('./components/managecontent/managecontent.component').then(m => m.ManagecontentComponent) },
      { path: 'managereport', loadComponent: () => import('./components/managereport/managereport.component').then(m => m.ManagereportComponent) },
      { path: 'adminprofile', loadComponent: () => import('./components/adminprofile/adminprofile.component').then(m => m.AdminprofileComponent) },
      { path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'helpcenter', loadComponent: () => import('./components/help-center/help-center.component').then(m => m.HelpCenterComponent) },
    ]
  }
];