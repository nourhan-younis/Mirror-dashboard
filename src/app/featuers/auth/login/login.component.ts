import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  providers: [AuthService],
})
export class LoginComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  authService = inject(AuthService);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  isLoading = false;

  login() {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please fill in all fields', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.isLoading = true;
      const { username, password } = this.loginForm.value;
    this.authService.login(username!,password!).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.snackBar.open('Login successful', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {
        console.log(err);
        
        this.snackBar.open(err.error?.message || 'Login failed', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false),
    });
  }
}
