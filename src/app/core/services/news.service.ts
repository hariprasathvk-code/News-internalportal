import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsSubmission, NewsResponse } from '../models/news.models';
import { environment } from '../../../environments/environment';

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

  getSubmittedNews(accessToken: string): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    };

    return this.http.get<any>(`${this.apiUrl}/my-submissions`, { headers });
  }
}
