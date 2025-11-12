import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
 
export interface AIValidationResponse {
  message: string;
  status?: string;
  newsId?: string;
  processedCount?: number;
  errors?: string[];
}
 
@Injectable({
  providedIn: 'root'
})
export class AIValidationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/news';
  validateAllArticles(): Observable<AIValidationResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
 
    console.log('🤖 Calling validate-all endpoint');
 
    return this.http.post<AIValidationResponse>(
      `${this.apiUrl}/validate-all`,
      {},
      { headers }
    );
  }

  validateAllAds(): Observable<AIValidationResponse> {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  console.log('🤖 Calling validate-all-ads endpoint');
  return this.http.post<AIValidationResponse>(
    environment.apiUrl + '/ads/validate-all',
    {"action": "validate-all"},
    { headers }
  );
}

validateSingleAd(adId: string): Observable<AIValidationResponse> {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  console.log('🤖 Calling validate-single-ad endpoint for:', adId);

  return this.http.post<AIValidationResponse>(
    environment.apiUrl + '/ads/validate-single',
    { AdId: adId },
    { headers }
  );
}

  validateSingleArticle(newsId: string, submittedDate: number): Observable<AIValidationResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
 
    console.log('🤖 Calling validate-single endpoint for:', newsId);
 
    return this.http.post<AIValidationResponse>(
      `${this.apiUrl}/validate-single`,
      {
        newsId: newsId,
        submittedDate: submittedDate.toString()
      },
      { headers }
    );
  }
}