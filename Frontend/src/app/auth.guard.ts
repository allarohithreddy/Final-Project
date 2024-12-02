import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Check if the user is logged in by checking for the token in localStorage
    const isAuthenticated = !!localStorage.getItem('token'); // Adjust based on your auth logic

    if (isAuthenticated) {
      return true; // Allow access to the route
    } else {
      alert("Please login to view respective page!!")
      // If not authenticated, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
