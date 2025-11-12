import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdSubmission } from '../models/ad-submission.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/ads';

  getAds(): Observable<AdSubmission[]> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<AdSubmission[]>(this.apiUrl, { headers });
  }

  approveAd(adId: string): Observable<any> {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  return this.http.post(
    `${this.apiUrl}/checked`,
    { AdId: adId, Action: "Approve" }, // Capitalized keys!
    { headers }
  );
}



  // approveAd(adId: string): Observable<any> {
  //   const token = localStorage.getItem('accessToken');
  //   const headers = {
  //     'Authorization': `Bearer ${token}`
  //   };
  //   return this.http.post(`${this.apiUrl}/checked`, {"Action":"approve",AdId: adId}, { headers });
  // }

  updateAd(adId: string, ad: AdSubmission): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.put(`${this.apiUrl}/${adId}`, ad, { headers });
  }
}
