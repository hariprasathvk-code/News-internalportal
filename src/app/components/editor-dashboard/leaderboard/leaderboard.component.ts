import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardResponse, CategoryRevenueItem } from '../..//../core/models/leaderboard.model';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="leaderboard-box" *ngIf="data">
      <h2>🏆 Category Revenue Leaderboard</h2>
      <p class="message">{{ data.message }}</p>
      <div class="stats-row">
        <div><b>Total Categories:</b> {{ data.totalCategories }}</div>
        <div><b>Overall Revenue:</b> ₹{{ data.overallRevenue | number:'1.2-2' }}</div>
      </div>
      <div class="top-info">
        <span class="topcat">🥇 Top: <b>{{ data.topCategory | titlecase }}</b></span>
        <span class="lowcat">🔻 Lowest: <b>{{ data.lowestCategory | titlecase }}</b></span>
      </div>
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Category</th>
            <th>Revenue (₹)</th>
            <th>% Share</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of data.ranking; let i = index"
              [class.first]="i === 0"
              [class.last]="i === data.ranking.length - 1">
            <td>{{ i + 1 }}</td>
            <td>
              <span [class.top-cat]="item.category === data.topCategory"
                    [class.low-cat]="item.category === data.lowestCategory">{{ item.category | titlecase }}</span>
            </td>
            <td>{{ item.amount | number:'1.2-2' }}</td>
            <td>{{ data.percentageShare[item.category] }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .leaderboard-box { padding: 2rem; background: #fff; border-radius: 16px; box-shadow: 0 2px 10px #eee; }
    .message { color: #414141; margin-bottom: 10px; }
    .stats-row { margin-bottom: 18px; font-size: 1.2rem; display: flex; gap: 2rem;}
    .top-info { margin-bottom: 16px; font-size: 1rem; display: flex; gap: 2rem;}
    .leaderboard-table { width: 100%; border-collapse: collapse; margin-top: 18px; }
    th, td { padding: 12px 10px; text-align: left; }
    th { background-color: #f5f5fa; }
    tbody tr.first td { background: #fefeec; font-weight: bold; }
    tbody tr.last td { background: #ffefef; }
    .top-cat { color: #008000; font-weight: bold; }
    .low-cat { color: #c0392b; font-weight: bold; }
    .topcat { color: #2b7a78; }
    .lowcat { color: #c0392b; }
  `]
})
export class LeaderboardComponent {
  @Input() data!: LeaderboardResponse | null;
}
