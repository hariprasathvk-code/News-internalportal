import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleDetail } from '../models/article-detail.model';
import { Observable } from 'rxjs';
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

  approveArticle(newsId: string): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.put(`${this.apiUrl}/${newsId}/approve`, {}, { headers });
  }

  updateArticle(newsId: string, article: ArticleDetail): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.put(`${this.apiUrl}/${newsId}`, article, { headers });
  }
}
