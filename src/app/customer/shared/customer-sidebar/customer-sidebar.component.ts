import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-customer-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './customer-sidebar.component.html',
  styleUrls: ['./customer-sidebar.component.css']
})
export class CustomerSidebarComponent {
  user: any;
  showLogoutModal = false;

  constructor(private router: Router, private authService: AuthService) {
    const currentUser = this.authService.getCurrentUser();
    const customers = this.authService['getCustomers']();
    const customer = customers.find((c: any) =>
      c.email === currentUser?.username || c.phone === currentUser?.username
    );
    this.user = {
      name: customer?.name || currentUser?.username || 'Guest',
      email: customer?.email || currentUser?.username || ''
    };
  }

  confirmLogout() {
    this.showLogoutModal = true;
  }

  logout() {
    this.showLogoutModal = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}