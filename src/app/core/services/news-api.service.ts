import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleDetail } from '../models/article-detail.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/news';

  getSubmittedArticles(): Observable<ArticleDetail[]> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<ArticleDetail[]>(this.apiUrl, { headers });
  }

  // ✅ FIXED: Correct URL format
  approveArticle(newsId: string, submittedDate: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // ✅ URL: /api/news/{newsId}/approve
    return this.http.put(
      `${this.apiUrl}/${newsId}/approve`,  // Correct format
      { submittedDate: submittedDate.toString() },
      { headers }
    ).pipe(
      catchError((error) => {
        if (error.status === 200 || error.status === 204) {
          return of({ success: true });
        }
        throw error;
      })
    );
  }

  // ✅ FIXED: Correct URL format
  rejectArticle(newsId: string, submittedDate: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // ✅ URL: /api/news/{newsId}/reject
    return this.http.put(
      `${this.apiUrl}/${newsId}/reject`,  // Correct format
      { submittedDate: submittedDate.toString() },
      { headers }
    ).pipe(
      catchError((error) => {
        if (error.status === 200 || error.status === 204) {
          return of({ success: true });
        }
        throw error;
      })
    );
  }

  updateArticle(newsId: string, article: ArticleDetail): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.put(`${this.apiUrl}/${newsId}`, article, { headers });
  }
}
