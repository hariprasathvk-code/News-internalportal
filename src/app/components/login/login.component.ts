import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/role.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    Email: ['', [Validators.required, Validators.email]],
    Password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage = '';
  isLoading = false;
  hidePassword = true;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('📤 Submitting login form:', this.loginForm.value);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (!response.Success) {
          this.errorMessage = 'Login failed';
          return;
        }
        
        console.log('🎉 Login successful!');
        
        const userRole = response.User.UserRole;
        console.log('🎭 User role from API:', userRole);
        
        if (userRole === UserRole.JOURNALIST) {
          console.log('📰 Navigating to journalist dashboard');
          this.router.navigate(['/journalist-dashboard']);
        } else if (userRole === UserRole.EDITOR) {
          console.log('✍️ Navigating to editor dashboard');
          this.router.navigate(['/editor-dashboard']);
        } else if (userRole === UserRole.ADVERTISER) {  // ✅ NEW ROLE HANDLING
          console.log('💼 Navigating to advertiser dashboard');
          this.router.navigate(['/advertiser-dashboard']);
        } else {
          console.error('❌ Unknown user role:', userRole);
          this.errorMessage = 'Invalid user role';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Login error:', error);
        
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else if (error.status === 403) {
          this.errorMessage = 'Access forbidden. Please check your credentials.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }

  getEmailErrorMessage(): string {
    const emailControl = this.loginForm.get('Email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl?.hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.loginForm.get('Password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }
}
