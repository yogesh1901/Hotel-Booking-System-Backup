import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  isMobileSidebarOpen = false;
  showLogoutConfirmation = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  openLogoutConfirmation() {
    this.showLogoutConfirmation = true;
  }

  cancelLogout() {
    this.showLogoutConfirmation = false;
  }

  confirmLogout() {
    this.authService.logout();
    this.showLogoutConfirmation = false;
    this.closeMobileSidebar();
    this.router.navigate(['/login']);
  }
}