import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly CUSTOMERS_KEY = 'hotel_customers';
  private readonly credentials = {
    admin: {
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin'
    }
  };

  private activeRoles: Set<string> = new Set();
  private readonly LOGIN_EVENT_KEY = 'login-event';
  private readonly LOGOUT_EVENT_KEY = 'logout-event';

  constructor(private router: Router) {
    this.initializeStorage();
    this.setupEventListeners();
  }

  private initializeStorage(): void {
    if (!localStorage.getItem(this.CUSTOMERS_KEY)) {
      localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify([]));
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.LOGIN_EVENT_KEY && event.newValue) {
        const userData = JSON.parse(event.newValue);
        this.activeRoles.add(userData.role);
      }

      if (event.key === this.LOGOUT_EVENT_KEY && event.newValue) {
        const userData = JSON.parse(event.newValue);
        this.activeRoles.delete(userData.role);
        if (this.getCurrentUser()?.role === userData.role) {
          this.clearAuthAndRedirect();
        }
      }
    });
  }

  // Main login function
  login(username: string, password: string): boolean {
    // Check admin credentials
    if (username === this.credentials.admin.email && password === this.credentials.admin.password) {
      return this.handleSuccessfulLogin(username, 'admin');
    }
    // Check customer credentials
    return this.customerLogin(username, password);
  }

  // Customer registration
  registerCustomer(customerData: any): true | string {
    const customers = this.getCustomers();
    // Check if user already exists by email or phone
    if (customers.some(c => (customerData.email && c.email === customerData.email) || (customerData.phone && c.phone === customerData.phone))) {
      return 'This email or phone is already registered';
    }
    customers.push({
      ...customerData,
      role: 'user' // Using 'user' to match your route data
    });
    localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
    return true;
  }

  // Customer login
  private customerLogin(username: string, password: string): boolean {
    const customer = this.getCustomers().find(c =>
      (c.email === username || c.phone === username) && c.password === password
    );
    if (customer) {
      return this.handleSuccessfulLogin(username, 'user'); // Using 'user' to match your route data
    }
    return false;
  }

  // Password reset
  requestPasswordReset(email: string): boolean {
    return this.getCustomers().some(c => c.email === email);
  }

  resetPassword(email: string, newPassword: string): boolean {
    const customers = this.getCustomers();
    const customerIndex = customers.findIndex(c => c.email === email);
    if (customerIndex >= 0) {
      customers[customerIndex].password = newPassword;
      localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
      return true;
    }
    return false;
  }

  // Helper methods
  private getCustomers(): any[] {
    return JSON.parse(localStorage.getItem(this.CUSTOMERS_KEY) || '[]');
  }

  private handleSuccessfulLogin(username: string, role: string): boolean {
    if (this.activeRoles.has(role)) {
      return false;
    }
    const token = this.generateToken();
    const userData = {
      username,
      role,
      token,
      expiresAt: Date.now() + 3600000 // 1 hour
    };
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('rememberUser', JSON.stringify(userData));
    this.activeRoles.add(role);
    this.broadcastLogin(userData);
    return true;
  }

  getCurrentUser(): any {
    const sessionUser = sessionStorage.getItem('currentUser');
    const localUser = localStorage.getItem('rememberUser');
    const userData = sessionUser ? JSON.parse(sessionUser) : localUser ? JSON.parse(localUser) : null;
    if (userData && new Date().getTime() > userData.expiresAt) {
      return null;
    }
    return userData;
  }

  isAuthenticated(): boolean {
    const userData = this.getCurrentUser();
    if (!userData) return false;
    if (new Date().getTime() > userData.expiresAt) {
      sessionStorage.removeItem('currentUser');
      localStorage.removeItem('rememberUser');
      return false;
    }
    return true;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + 
           Math.random().toString(36).substring(2);
  }

  isRoleActive(role: string): boolean {
    return this.activeRoles.has(role);
  }

  private broadcastLogin(userData: any): void {
    localStorage.setItem(this.LOGIN_EVENT_KEY, JSON.stringify(userData));
    setTimeout(() => localStorage.removeItem(this.LOGIN_EVENT_KEY), 100);
  }
  private broadcastLogout(userData: any): void {
    localStorage.setItem(this.LOGOUT_EVENT_KEY, JSON.stringify(userData));
    setTimeout(() => localStorage.removeItem(this.LOGOUT_EVENT_KEY), 100);
  }
  private clearAuthAndRedirect(): void {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    this.router.navigate(['/login'], {
      replaceUrl: true,
      state: { cleared: true }
    });
  }

  logout(): void {
    const role = this.getCurrentUser()?.role;
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    if (role) {
      this.activeRoles.delete(role);
      this.broadcastLogout({ role });
    }
    this.router.navigate(['/login'], {
      replaceUrl: true,
      state: { cleared: true }
    });
  }

  // Optionally, keep these for compatibility
  getAdminEmail(): string {
    return this.credentials.admin.email;
  }
}