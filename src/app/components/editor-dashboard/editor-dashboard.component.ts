import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { EditorSidebarComponent } from './editor-sidebar/editor-sidebar.component';
import { CardSummaryComponent } from './card-summary/card-summary.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { AdSubmissionListComponent } from './ad-submission-list/ad-submission-list.component';

import { NewsApiService } from '../../core/services/news-api.service';
import { AdApiService } from '../../core/services/ad-api.service';
import { ArticleDetail } from '../../core/models/article-detail.model';
import { AdSubmission } from '../../core/models/ad-submission.model';

@Component({
  selector: 'app-editor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    EditorSidebarComponent,
    CardSummaryComponent,
    ArticleListComponent,
    AdSubmissionListComponent
  ],
  templateUrl: './editor-dashboard.component.html',
  styleUrls: ['./editor-dashboard.component.scss']
})
export class EditorDashboardComponent implements OnInit {
  private newsApi = inject(NewsApiService);
  private adApi = inject(AdApiService);
  private router = inject(Router);

  articles: ArticleDetail[] = [];
  ads: AdSubmission[] = [];
  selectedSection = 'news';

  summaryCards = [
    { label: 'Total News', value: 0, note: 'All articles', change: 0 },
    { label: 'Active Ads', value: 0, note: 'Running campaigns', change: 0 },
    { label: 'Pending Reviews', value: 0, note: 'Awaiting approval', change: 0 },
    { label: 'Published Today', value: 0, note: 'Live articles', change: 0 }
  ];

  ngOnInit() {
    this.loadSubmittedArticles();
  }

  onSidebarSection(section: string) {
    this.selectedSection = section;
    console.log('Section changed to:', section);

    if (section === 'news') {
      this.loadSubmittedArticles();
    } else if (section === 'ads') {
      this.loadAds();
    }
  }

  loadSubmittedArticles() {
    this.newsApi.getSubmittedArticles().subscribe({
      next: (data) => {
        console.log('📰 Articles loaded:', data);
        this.articles = data;
        this.summaryCards[0].value = data.length || 0;
      },
      error: (error) => {
        console.error('❌ Error loading articles:', error);
      }
    });
  }

  loadAds() {
    this.adApi.getAds().subscribe({
      next: (data) => {
        console.log('📢 Ads loaded:', data);
        this.ads = data;
        this.summaryCards[1].value = data.length || 0;
      },
      error: (error) => {
        console.error('❌ Error loading ads:', error);
      }
    });
  }

  checkWithAI() {
    alert('🤖 AI Check clicked! (Coming soon)');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
