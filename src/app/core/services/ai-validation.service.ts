import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AIValidationResponse {
  success: boolean;
  message: string;
  processed: number;
  approved: number;
  rejected: number;
  results?: Array<{
    NewsId: string;
    Title: string;
    Status: string;
    Decision: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class AIValidationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/news/validate';

  validateAllArticles(): Observable<AIValidationResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('🤖 Calling AI validation endpoint:', this.apiUrl);

    return this.http.post<AIValidationResponse>(this.apiUrl, {}, { headers });
  }
}
