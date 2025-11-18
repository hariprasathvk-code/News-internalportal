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
  //private categoryApiUrl = environment.categoryApiUrl ;
 
  getSubmittedArticles(): Observable<ArticleDetail[]> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<ArticleDetail[]>(this.apiUrl, { headers });
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

  rejectArticle(newsId: string, submittedDate: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

 
    return this.http.put(
      `${this.apiUrl}/${newsId}/reject`,  
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

  // getNewsByCategory(category: string): Observable<any[]> {
  //   const token = localStorage.getItem('idToken');
  //   const headers = {
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   };
  //   return this.http.get<any[]>(
  //     `${environment.apiUrl}/category?category=${category}`,
  //     { headers }
  //   );
  // }


  updateArticle(newsId: string, article: ArticleDetail): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.put(`${this.apiUrl}/${newsId}`, article, { headers });
  }

  // Update article content (for AI rephrasing)
updateArticleContent(newsId: string, submittedDate: number, data: any): Observable<any> {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const payload = {
    NewsId: newsId,
    SubmittedDate: submittedDate,
    ...data  // Title, Summary, Content fields
  };

  return this.http.put(
    `${this.apiUrl}/${newsId}/update`,
    payload,
    { headers }
  );
}


// In NewsApiService

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
 
 