import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, User } from '../models/user.model';
import { UserRole } from '../models/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  currentUser = signal<User | null>(null);

  constructor() {
    // ✅ FIXED: Better localStorage handling
    try {
      const storedUser = localStorage.getItem('user');
      
      // Check if storedUser exists and is not "undefined" string
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
        console.log('✅ Loaded user from localStorage:', user);
      } else {
        console.log('⚠️ No valid user in localStorage');
        // Clear invalid data
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('❌ Error loading user from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('role');
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('🔑 Login request:', credentials);
    console.log('🌐 API URL:', `${environment.apiUrl}/login`);
    
    return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, credentials)
      .pipe(
        tap((response: LoginResponse) => {
          console.log('✅ Login response:', response);
          
          if (response.Success) {
            // ✅ Store tokens and user data
            localStorage.setItem('accessToken', response.AccessToken);
            localStorage.setItem('idToken', response.IdToken);
            localStorage.setItem('role', response.User.UserRole);
            localStorage.setItem('user', JSON.stringify(response.User));
            
            this.currentUser.set(response.User);
            
            console.log('💾 Stored role:', response.User.UserRole);
            console.log('💾 Stored user:', response.User);
          }
        })
      );
  }

  logout(): void {
    console.log('🚪 Logging out...');
    
    // Clear all stored data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    
    // Reset current user
    this.currentUser.set(null);
    
    // Navigate to login
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem('accessToken');
    return (token && token !== 'undefined' && token !== 'null') ? token : null;
  }

  getIdToken(): string | null {
    const token = localStorage.getItem('idToken');
    return (token && token !== 'undefined' && token !== 'null') ? token : null;
  }

  getRole(): UserRole | null {
    const role = localStorage.getItem('role');
    if (!role || role === 'undefined' || role === 'null') {
      return null;
    }
    return role as UserRole;
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  getCurrentUser(): User | null {
    try {
      const user = localStorage.getItem('user');
      if (!user || user === 'undefined' || user === 'null') {
        return null;
      }
      return JSON.parse(user);
    } catch (error) {
      console.error('❌ Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  }
}
