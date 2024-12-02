import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  firstName = '';
  lastName = '';
  username = '';
  phone = '';
  password = '';
  confirmPassword = '';
  errors: any = {};
  message = '';

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if a token exists in localStorage
  }
  
  validateForm() {
    const errors: any = {};

    if (!this.firstName.trim()) {
      errors.firstName = 'First Name is required';
    }
    if (!this.lastName.trim()) {
      errors.lastName = 'Last Name is required';
    }
    if (!this.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!this.phone.trim()) {
      errors.phone = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(this.phone)) {
      errors.phone = 'Phone Number must be 10 digits';
    }
    if (!this.password.trim()) {
      errors.password = 'Password is required';
    }
    if (this.password !== this.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    if (this.validateForm()) {
      try {
        const response = await axios.post('http://138.197.126.184:3000/api/signup', {
          first_name: this.firstName,
          last_name: this.lastName,
          username: this.username,
          phone_number: this.phone,
          password: this.password,
        });

        console.log('Form submitted successfully!', response.data);
        this.message = 'Registration successful!';
      } catch (error: any) {
        if (error.response && error.response.data.error.includes('Duplicate Entry')) {
          this.message = 'Registration failed. Please check the form.';
          this.errors.server = error.response.data.error || 'Server error';
        } else {
          this.message = 'Registration failed. Please check the form.';
          this.errors.server = error.response.data.error || 'Server error';
        }
      }
    } else {
      console.log('Form validation failed');
      this.message = 'Please fill in all required fields.';
    }
  }
}
