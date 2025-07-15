import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  public isLoggedIn = false;
  public user: { username: string, role: string } | null = null;
  private storageListener: any;
  showDropdown = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.updateUserState();
    this.storageListener = (event: StorageEvent) => {
      if (event.key === 'login-event' || event.key === 'logout-event') {
        this.updateUserState();
      }
    };
    window.addEventListener('storage', this.storageListener);
  }

  ngOnDestroy() {
    window.removeEventListener('storage', this.storageListener);
  }

  private updateUserState() {
    this.user = this.authService.getCurrentUser();
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  scrollToSection(fragment: string) {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.performScroll(fragment), 100);
      });
    } else {
      this.performScroll(fragment);
    }
    this.closeMobileMenu();
  }

  private performScroll(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      // Get the height of the sticky navbar
      const navbar = document.querySelector('header.sticky');
      const offset = navbar ? (navbar as HTMLElement).offsetHeight : 0;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset - 8, // 8px extra spacing
        behavior: 'smooth'
      });
    }
  }

  public logout() {
    this.authService.logout();
    this.updateUserState();
  }

  public getUserDisplayName(): string {
    if (this.user && this.user.username) {
      return this.user.username.split('@')[0];
    }
    return 'User';
  }
}