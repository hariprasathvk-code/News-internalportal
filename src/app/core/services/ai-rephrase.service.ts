import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RephraseRequest {
  NewsId: string;
  SubmittedDate: number;
  RephraseTitle: boolean;
  RephraseSummary: boolean;
  RephraseContent: boolean;
}

export interface RephraseResponse {
  success: boolean;
  message: string;
  data: {
    NewsId: string;
    OriginalTitle: string;
    OriginalSummary: string;
    OriginalContent: string;
    ImprovedTitle?: string;
    ImprovedSummary?: string;
    ImprovedContent?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AiRephraseService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  rephraseArticle(request: RephraseRequest): Observable<RephraseResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('🤖 Rephrasing article:', request);

    return this.http.post<RephraseResponse>(
      `${this.apiUrl}/rephrase`,
      request,
      { headers }
    );
  }
}
