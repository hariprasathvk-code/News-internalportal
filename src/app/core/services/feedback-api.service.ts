import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
    return this.http.get<Feedback[]>(`${this.apiUrl}`);
  }
}
