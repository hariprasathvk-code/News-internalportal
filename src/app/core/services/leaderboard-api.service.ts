import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LeaderboardResponse } from '../models/leaderboard.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.leaderboardUrl; // Set this in your env files

  getLeaderboard(): Observable<LeaderboardResponse> {
  return this.http.get<any>(this.apiUrl).pipe(
    map(resp => typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body)
  );
}

}
