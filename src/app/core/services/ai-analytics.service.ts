import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AIAnalytics {
  articlesValidated: number;
  approved: number;
  rejected: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIAnalyticsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAIAnalytics(): Observable<AIAnalytics> {
    const token = localStorage.getItem('accessToken');
    
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.apiUrl}/news/AIInsightsAnalytics`;
    console.log('📊 Fetching AI Analytics from:', url);

    return this.http.get<AIAnalytics>(url, { headers });
  }
}
