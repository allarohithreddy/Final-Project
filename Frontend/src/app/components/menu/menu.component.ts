import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  constructor(private router: Router, private cdr: ChangeDetectorRef) {} // Inject ChangeDetectorRef

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if a token exists in localStorage
  }

  // Call this after login/logout to refresh UI
  refreshView() {
    this.cdr.detectChanges(); // Trigger change detection manually
  }

  logout() {
    localStorage.removeItem('token');  // Remove the token from localStorage
    this.refreshView(); // Ensure the view updates
    this.router.navigate(['/login']);  // Navigate to login page
  }
}
