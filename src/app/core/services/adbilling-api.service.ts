import { Injectable, inject } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AdBilling } from '../models/ad-billing.model';

import { environment } from '../../../environments/environment';
 
@Injectable({

  providedIn: 'root'

})

export class AdBillingService {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/ads/getadbills'; // Lambda endpoint
 
  getBilling(limit: number = 20, lastKey?: any): Observable<{ bills: AdBilling[], lastKey: any }> {

    const token = localStorage.getItem('accessToken');

    const headers = { 'Authorization': `Bearer ${token}` };
 
    let params = new HttpParams().set('limit', limit);

    if (lastKey) params = params.set('lastKey', JSON.stringify(lastKey));
 
    return this.http.get<{ bills: AdBilling[], lastKey: any }>(this.apiUrl, { headers, params });

  }

}
 