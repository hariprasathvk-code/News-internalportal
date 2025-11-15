import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AIAdAnalytics {
  adsValidated: number;
  approved: number;
  rejected: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIAdAnalyticsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAIAdAnalytics(): Observable<AIAdAnalytics> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const url = `${this.apiUrl}/news/AIAdInsights`;
    console.log('📢 Fetching AI Ad Analytics from:', url);

    return this.http.get<AIAdAnalytics>(url, { headers });
  }
}
