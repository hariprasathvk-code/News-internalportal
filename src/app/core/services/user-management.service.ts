import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Journalist {
  UserId: string;
  EditorId: string;
  Email: string;
  FullName: string;
  PhoneNumber: string;
  UserRole: string;
  CreatedAt?: string;
  Password?: string; // Only returned on creation
}

export interface CreateJournalistRequest {
  EditorId: string;
  Email: string;
  FullName: string;
  PhoneNumber: string;
  UserRole: string;
}

export interface CreateJournalistResponse {
  success: boolean;
  message: string;
  journalist: Journalist;
  generatedPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/users';

  // Get all journalists created by this editor
  getJournalists(editorId: string): Observable<Journalist[]> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.get<Journalist[]>(
      `${this.apiUrl}/journalists?editorId=${editorId}`,
      { headers }
    );
  }

  // Create new journalist
  createJournalist(data: CreateJournalistRequest): Observable<CreateJournalistResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.post<CreateJournalistResponse>(
      `${this.apiUrl}/journalists`,
      data,
      { headers }
    );
  }

  // Update journalist
  updateJournalist(userId: string, data: Partial<Journalist>): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.put(
      `${this.apiUrl}/journalists/${userId}`,
      data,
      { headers }
    );
  }

  // Delete journalist
  deleteJournalist(userId: string): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.delete(
      `${this.apiUrl}/journalists/${userId}`,
      { headers }
    );
  }
}
