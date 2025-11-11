// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdService {
//   private apiUrl = 'https://your-api-endpoint/api'; // 🔹 replace with your backend URL

//   constructor(private http: HttpClient) {}

//   getAllAds(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/ads`);
//   }

//   getBilling(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/billing`);
//   }
// createAd(adData: any) {
//   const apiUrl = 'https://YOUR_API_GATEWAY_URL_HERE'; // 🔹 Replace with your real AWS Lambda endpoint
//   return this.http.post(apiUrl, adData);
// }

//   // createAd(adData: any): Observable<any> {
//   //   return this.http.post(`${this.apiUrl}/ads`, adData);
//   // }
// }
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, of, from } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { Ad, SubCategory, Region } from '../models';
// import { environment } from '../../../environments/environment';
// import { Auth } from 'aws-amplify';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdService {
//   private baseUrl = environment.adsapiUrl || 'https://qrqrsk7iad.execute-api.us-east-2.amazonaws.com/prod';

//   constructor(private http: HttpClient) {}

//   /** 🔹 Helper to get Cognito ID token */
//   private getAuthHeaders(): Observable<HttpHeaders> {
//     return from(Auth.currentSession()).pipe(
//       switchMap(session => {
//         const token = session.getIdToken().getJwtToken();
//         const headers = new HttpHeaders({
//           'Content-Type': 'application/json',
//           Authorization: token
//         });
//         return of(headers);
//       })
//     );
//   }

//   /** 🔹 Create Advertisement */
//   createAd(adData: Ad): Observable<any> {
//     return this.getAuthHeaders().pipe(
//       switchMap(headers => this.http.post(`${this.baseUrl}/ads`, adData, { headers }))
//     );
//   }

//   /** 🔹 Fetch All Ads */
//   getAllAds(): Observable<Ad[]> {
//     return this.getAuthHeaders().pipe(
//       switchMap(headers => this.http.get<Ad[]>(`${this.baseUrl}/ads`, { headers }))
//     );
//   }

//   /** 🔹 Delete Ad by ID */
//   deleteAd(id: string): Observable<any> {
//     return this.getAuthHeaders().pipe(
//       switchMap(headers => this.http.delete(`${this.baseUrl}/ads/${id}`, { headers }))
//     );
//   }

//   /** 🔹 Get Billing Data */
//   getBilling(): Observable<any> {
//     return this.getAuthHeaders().pipe(
//       switchMap(headers => this.http.get(`${this.baseUrl}/billing`, { headers }))
//     );
//   }

//   /** 🔹 (Mock) Get Subcategories */
//   getSubCategories(): Observable<SubCategory[]> {
//     return of([
//       { id: '1', name: 'Politics' },
//       { id: '2', name: 'Sports' },
//       { id: '3', name: 'Regional' },
//       { id: '4', name: 'Finance' },
//       { id: '5', name: 'Defence' },
//       { id: '6', name: 'Entertainment' }
//     ]);
//   }

//   /** 🔹 (Mock) Get Regions */
//   getRegions(): Observable<Region[]> {
//     return of([
//       { id: '1', name: 'National' },
//       { id: '2', name: 'International' }
//     ]);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Ad, SubCategory, Region } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private baseUrl = environment.adsapiUrl || 'https://qrqrsk7iad.execute-api.us-east-2.amazonaws.com/prod/api';

  constructor(private http: HttpClient) {}

  // ✅ Use the token stored from your Login API
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert("You are not logged in. Please login again.");
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ✅ Create Ad
  createAd(adData: Ad): Observable<any> {
    return this.http.post(`${this.baseUrl}/ads`, adData, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get All Ads
  getAllAds(): Observable<Ad[]> {
    return this.http.get<Ad[]>(`${this.baseUrl}/ads`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Delete Ad
  deleteAd(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ads/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Billing / Usage History
  getBilling(): Observable<any> {
    return this.http.get(`${this.baseUrl}/billing`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Static Sub-Categories
  getSubCategories(): Observable<SubCategory[]> {
    return of([
      { id: '1', name: 'Politics' },
      { id: '2', name: 'Sports' },
      { id: '3', name: 'Regional' },
      { id: '4', name: 'Finance' },
      { id: '5', name: 'Defence' },
      { id: '6', name: 'Entertainment' }
    ]);
  }

  // ✅ Static Regions
  getRegions(): Observable<Region[]> {
    return of([
      { id: '1', name: 'National' },
      { id: '2', name: 'International' }
    ]);
  }
}
