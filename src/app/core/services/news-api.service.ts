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

  getRejectedArticles(): Observable<ArticleDetail[]> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<ArticleDetail[]>(`${this.apiUrl}/rejected`, { headers });
  }

  approveArticle(newsId: string, priority: number, lifecycle: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.post(
      `${this.apiUrl}/approve`,
      {
        newsId: newsId,
        priority: priority,
        lifecycle: lifecycle
      },
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

  updateAuditStatus(newsId: string, status: string): Observable<any> {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  return this.http.put(
    `${environment.auditNewsApiUrl}/${newsId}/status`, // path per your API Gateway setup
    { NewsId: newsId, Status: status},
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


  // ✅ Updated reject method with remark
  rejectArticle(newsId: string, submittedDate: number, remark: string): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.put(
      `${this.apiUrl}/${newsId}/reject`,  
      { 
        submittedDate: submittedDate.toString(),
        remark: remark
      },
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

  updateArticleContent(newsId: string, submittedDate: number, data: any): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const payload = {
      NewsId: newsId,
      SubmittedDate: submittedDate,
      ...data
    };

    return this.http.put(
      `${this.apiUrl}/${newsId}/update`,
      payload,
      { headers }
    );
  }

  getApprovedNewsByCategoryId(categoryId: number): Observable<any> {
    const token = localStorage.getItem('idToken'); 
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    return this.http.get(
      `${environment.categoryApiUrl}/${categoryId}`,
      { headers }
    );
  }
}
