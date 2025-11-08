import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReportResponse {
  success: boolean;
  message: string;
  reportType: string;
  data?: any;
  generatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/news/reports';

  /**
   * Get Finance Report
   */
  getFinanceReport(): Observable<ReportResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('💰 Fetching Finance Report...');

    return this.http.get<ReportResponse>(`${this.apiUrl}?type=finance`, { headers });
  }

  /**
   * Get User Management Report
   */
  getUserManagementReport(): Observable<ReportResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('👥 Fetching User Management Report...');

    return this.http.get<ReportResponse>(`${this.apiUrl}?type=usermanagement`, { headers });
  }

  /**
   * Get History Report
   */
  getHistoryReport(): Observable<ReportResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('📜 Fetching History Report...');

    return this.http.get<ReportResponse>(`${this.apiUrl}?type=history`, { headers });
  }
}
