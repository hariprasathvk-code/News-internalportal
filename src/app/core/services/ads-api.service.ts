import { Injectable, inject } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AdSubmission } from '../models/ad-submission.model';

import { environment } from '../../../environments/environment';
 
@Injectable({

  providedIn: 'root'

})

export class AdsApiService {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/ads/getadtable'; // Lambda endpoint
 
  getAds(limit: number = 10, lastKey?: any): Observable<{ ads: AdSubmission[], lastKey: any }> {

    const token = localStorage.getItem('accessToken');

    const headers = { 'Authorization': `Bearer ${token}` };
 
    let params = new HttpParams().set('limit', limit);

    if (lastKey) {

      params = params.set('lastKey', JSON.stringify(lastKey));

    }
 
    return this.http.get<{ ads: AdSubmission[], lastKey: any }>(this.apiUrl, { headers, params });

  }

}

 