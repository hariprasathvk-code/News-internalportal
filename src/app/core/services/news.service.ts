import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsSubmission, NewsResponse } from '../models/news.models';
import { environment } from '../../../environments/environment';
import { ArticleDetail } from '../models/article-detail.model';
@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = environment.apiUrl + '/news';

  constructor(private http: HttpClient) { }

  submitNews(news: NewsSubmission, accessToken: string): Observable<NewsResponse> {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    return this.http.post<NewsResponse>(this.apiUrl, news, { headers });
  }
//    submitAuditNews(news: NewsSubmission): Observable<NewsResponse> {
//   const headers = {
//     // 'Authorization': `Bearer ${accessToken}`,
//     'Content-Type': 'application/json'
//   };

//   return this.http.post<NewsResponse>(environment.auditNewsApiUrl, news, { headers });
// }

submitAuditNews(news: NewsSubmission): Observable<NewsResponse> {
  return this.http.post<NewsResponse>(environment.auditNewsApiUrl, news, { 
    headers: { 'Content-Type': 'application/json' } 
  });
}
 getAuthorAuditSubmissions(author: string): Observable<any[]> {
    const url = `${environment.auditNewsApiUrl}?author=${encodeURIComponent(author)}`;
    return this.http.get<any[]>(url);
  }

  updateArticle(newsId: string, article: ArticleDetail): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.put(`${this.apiUrl}/${newsId}`, article, { headers });
  }


updateArticleContentNewTable(newsId: string, submittedDate: number, data: any): Observable<any> {
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
    `${environment.auditNewsApiUrl}/${newsId}`,   
    payload,
    { headers }
  );
}

  getSubmittedNews(accessToken: string): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    };

    return this.http.get<any>(`${this.apiUrl}/my-submissions`, { headers });
  }
}
