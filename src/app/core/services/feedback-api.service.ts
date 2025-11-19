import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';

export interface Feedback {
  contactId: string;
  email: string;
  feedback: string;
  name: string;
  submittedAt: string;  // ISO string date
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.feedbackUrl;  // Replace with real API URL

  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((resp: any) => {
        // Parse the body if it's a string (Lambda proxy response)
        let data = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp;
        
        // Ensure it's an array
        return Array.isArray(data) ? data : [];
      })
    );
  }
}
