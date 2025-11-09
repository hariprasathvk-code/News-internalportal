import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReportResponse {
  success?: boolean;
  message?: string;
  reportType?: string;
  
  // ✅ Your Lambda uses downloadUrl
  downloadUrl?: string;
  
  // Support other variations too
  s3Url?: string;
  s3_url?: string;
  S3Url?: string;
  url?: string;
  fileUrl?: string;
  
  s3Key?: string;
  fileName?: string;
  data?: any;
  generatedAt?: string;
  totalRecords?: number;
  
  // Allow any other fields
  [key: string]: any;
}


@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private http = inject(HttpClient);
  private reportsApiUrl = environment.reportsApiUrl; // ✅ NEW API URL

  /**
   * Generate Subscription Report
   */
  generateSubscriptionReport(): Observable<ReportResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('📊 Generating Subscription Report...');

    return this.http.post<ReportResponse>(
      `${this.reportsApiUrl}/generate-subscription-report`, 
      {}, 
      { headers }
    );
  }

  /**
   * Generate News Report
   */
  generateNewsReport(): Observable<ReportResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('📰 Generating News Report...');

    return this.http.post<ReportResponse>(
      `${this.reportsApiUrl}/generate-news-report`, 
      {}, 
      { headers }
    );
  }

  /**
   * Generate Ad Report
   */
  generateAdReport(): Observable<ReportResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('📢 Generating Ad Report...');

    return this.http.post<ReportResponse>(
      `${this.reportsApiUrl}/generate-ad-report`, 
      {}, 
      { headers }
    );
  }

  downloadFileFromUrl(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }
}
