// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';

// export interface Journalist {
//   UserId: string;
//   EditorId: string;
//   Email: string;
//   FullName: string;
//   PhoneNumber: string;
//   UserRole: string;
//   CreatedAt?: string;
//   Password?: string; // Only returned on creation
// }

// export interface CreateJournalistRequest {
//   EditorId: string;
//   Email: string;
//   FullName: string;
//   PhoneNumber: string;
//   UserRole: string;
// }

// export interface CreateJournalistResponse {
//   success: boolean;
//   message: string;
//   journalist: Journalist;
//   generatedPassword: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class UserManagementService {
//   private http = inject(HttpClient);
//   private apiUrl = environment.apiUrl + '/user';

//   // Get all journalists created by this editor
//   getJournalists(editorId: string): Observable<Journalist[]> {
//     const token = localStorage.getItem('accessToken');
//     const headers = {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };

//     return this.http.get<Journalist[]>(
//       `${this.apiUrl}/journalists?editorId=${editorId}`,
//       { headers }
//     );
//   }

//   // Create new journalist
//   createJournalist(data: CreateJournalistRequest): Observable<CreateJournalistResponse> {
//     const token = localStorage.getItem('accessToken');
//     const headers = {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };

//     return this.http.post<CreateJournalistResponse>(
//       `${environment.apiUrl}/register`,
//       data,
//       { headers }
//     );
//   }

//   // Update journalist
//   updateJournalist(userId: string, data: Partial<Journalist>): Observable<any> {
//     const token = localStorage.getItem('accessToken');
//     const headers = {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };

//     return this.http.put(
//       `${this.apiUrl}/journalists/${userId}`,
//       data,
//       { headers }
//     );
//   }

//   // Delete journalist
//   deleteJournalist(userId: string): Observable<any> {
//     const token = localStorage.getItem('accessToken');
//     const headers = {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };

//     return this.http.delete(
//       `${this.apiUrl}/journalists/${userId}`,
//       { headers }
//     );
//   }
// }


import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Journalist {
  UserId: string;
  EditorId?: string;
  Email: string;
  FullName: string;
  PhoneNumber: string;
  UserRole: string;
  NewsCount?: number;
  CreatedAt?: string;
}

export interface CreateJournalistRequest {
  EditorId: string;
  Email: string;
  FullName: string;
  PhoneNumber: string;
  UserRole: string;
}

export interface BackendRegisterResponse {
  Success: boolean;
  Message: string;
  UserId: string;
  TempPassword: string;
  User: {
    UserId: string;
    Email: string;
    FullName: string;
    PhoneNumber: string;
    UserRole: string;
    NewsCount: number;
  };
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
  private apiUrl = environment.apiUrl + '/user';

  // Get all users
  getJournalists(): Observable<Journalist[]> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.get<Journalist[]>(
      `${this.apiUrl}`,
      { headers }
    );
  }

  // Create new user
  createJournalist(data: CreateJournalistRequest): Observable<CreateJournalistResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.post<BackendRegisterResponse>(
      `${environment.apiUrl}/register`,
      data,
      { headers }
    ).pipe(
      map((backendResponse: BackendRegisterResponse) => {
        return {
          success: backendResponse.Success,
          message: backendResponse.Message,
          journalist: {
            UserId: backendResponse.User.UserId,
            Email: backendResponse.User.Email,
            FullName: backendResponse.User.FullName,
            PhoneNumber: backendResponse.User.PhoneNumber,
            UserRole: backendResponse.User.UserRole,
            NewsCount: backendResponse.User.NewsCount
          },
          generatedPassword: backendResponse.TempPassword
        };
      })
    );
  }

  // ✅ UPDATED: Update user - matches backend expectation
  updateJournalist(userId: string, editorId: string, data: Partial<Journalist>): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Backend expects: EditorId, UserId, FullName, PhoneNumber, UserRole
    const payload = {
      EditorId: editorId,
      UserId: userId,
      FullName: data.FullName,
      PhoneNumber: data.PhoneNumber,
      UserRole: data.UserRole
    };

    console.log('🔗 PUT URL:', this.apiUrl);
    console.log('📦 PUT Payload:', payload);

    return this.http.put(
      `${this.apiUrl}`,
      payload,
      { headers }
    );
  }

  // ✅ UPDATED: Delete user - matches backend expectation
  deleteJournalist(userId: string, editorId: string, userRole: string): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Backend expects: EditorId, UserId, UserRole
    const payload = {
      EditorId: editorId,
      UserId: userId,
      UserRole: userRole
    };

    console.log('🔗 DELETE URL:', this.apiUrl);
    console.log('🗑️ DELETE Payload:', payload);

    return this.http.delete(
      `${this.apiUrl}`,
      {
        headers,
        body: payload
      }
    );
  }
}
