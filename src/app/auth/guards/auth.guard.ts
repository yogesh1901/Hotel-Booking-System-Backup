// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['cleared']) {
      return true;
    }
    // Allow access to auth pages
    if (next.data['isLoginPage']) {
      return true;
    }
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getCurrentUser()?.role;
      const requiredRole = next.data['role'];
      // Check if route requires specific role
      if (requiredRole && userRole !== requiredRole) {
        // Redirect to appropriate dashboard
        const redirectPath = userRole === 'admin' ? '/dashboard' : '/user-dashboard';
        this.router.navigate([redirectPath]);
        return false;
      }
      return true;
    }
    // Not authenticated - redirect to login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}