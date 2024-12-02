// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';
  errors: any = {};

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errors = { server: 'username and password are required.' };
      return;
    }

    const loginData = this.loginForm.value;
    this.http.post<any>('http://138.197.126.184:3000/api/login', loginData)
      .subscribe(
        (response) => {
          if (response.success) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/dashboard']);
          } else {
            this.errors = { server: response.message };
          }
        },
        (error) => {
          if (error.status === 401) {
            this.errors = { server: 'Incorrect username or password' };
          } else if (error.status === 404) {
            this.errors = { server: 'User not found' };
          } else {
            this.errors = { server: error.message || 'An error occurred during login.' };
          }
        }
      );
  }
}
