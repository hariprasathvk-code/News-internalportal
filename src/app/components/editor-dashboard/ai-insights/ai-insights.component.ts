import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIAnalyticsService, AIAnalytics } from '../../../core/services/ai-analytics.service';
import { AIAdAnalyticsService, AIAdAnalytics } from '../../../core/services/ai-ad-analytics.service';
import { forkJoin } from 'rxjs';

type ViewType = 'articles' | 'ads';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-insights.component.html',
  styleUrls: ['./ai-insights.component.scss']
})
export class AIInsightsComponent implements OnInit {
  private aiAnalyticsService = inject(AIAnalyticsService);
  private aiAdAnalyticsService = inject(AIAdAnalyticsService);

  // Data
  articleAnalytics: AIAnalytics | null = null;
  adAnalytics: AIAdAnalytics | null = null;
  
  // UI State
  currentView: ViewType = 'articles';
  isLoading = false;
  error: string | null = null;
  showRejectionPopup = false;

  ngOnInit() {
    this.loadAllAnalytics();
  }

  loadAllAnalytics() {
    this.isLoading = true;
    this.error = null;

    console.log('📡 Loading AI Analytics...');

    forkJoin({
      articles: this.aiAnalyticsService.getAIAnalytics(),
      ads: this.aiAdAnalyticsService.getAIAdAnalytics()
    }).subscribe({
      next: (data) => {
        this.articleAnalytics = data.articles;
        this.adAnalytics = data.ads;
        this.isLoading = false;
        console.log('✅ Articles Analytics:', data.articles);
        console.log('✅ Ad Analytics:', data.ads);
      },
      error: (error) => {
        console.error('❌ Error loading AI analytics:', error);
        this.error = error.error?.message || 'Failed to load AI analytics';
        this.isLoading = false;
      }
    });
  }

  switchView(view: ViewType) {
    this.currentView = view;
  }

  openRejectionPopup() {
    if (this.rejected > 0) {
      this.showRejectionPopup = true;
    }
  }

  closeRejectionPopup() {
    this.showRejectionPopup = false;
  }

  get rejectionRules(): string[] {
    if (this.currentView === 'articles') {
      return [
        'Title is present and clearly matches the article\'s main topic.',
        'Content uses coherent sentences (professional tone; minor typos OK).',
        'No hate speech, harassment, or explicit/graphic violence is present.',
        'Article contains factual information without misleading claims.',
        'Source is credible and properly attributed.',
        'No plagiarism or copyright violations detected.'
      ];
    } else {
      return [
        'Ad title is present and clearly describes the product/service.',
        'Content uses professional language (minor typos OK).',
        'No hate speech, harassment, or explicit/graphic violence is present.',
        'Ad does not promote illegal products or services.',
        'Claims are truthful and not misleading.',
        'Ad complies with advertising standards and regulations.'
      ];
    }
  }

  get currentAnalytics() {
    return this.currentView === 'articles' ? this.articleAnalytics : this.adAnalytics;
  }

  get itemsValidated(): number {
    if (!this.currentAnalytics) return 0;
    return this.currentView === 'articles' 
      ? (this.currentAnalytics as AIAnalytics).articlesValidated 
      : (this.currentAnalytics as AIAdAnalytics).adsValidated;
  }

  get approved(): number {
    return this.currentAnalytics?.approved || 0;
  }

  get rejected(): number {
    return this.currentAnalytics?.rejected || 0;
  }

  get timeSavedMinutes(): number {
    if (!this.currentAnalytics) return 0;
    const minutesPerItem = this.currentView === 'articles' ? 5 : 3;
    return this.itemsValidated * minutesPerItem;
  }

  get timeSavedFormatted(): string {
    const totalMinutes = this.timeSavedMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  get approvalRate(): number {
    if (!this.currentAnalytics || this.itemsValidated === 0) return 0;
    return Math.round((this.approved / this.itemsValidated) * 100);
  }

  get rejectionRate(): number {
    if (!this.currentAnalytics || this.itemsValidated === 0) return 0;
    return Math.round((this.rejected / this.itemsValidated) * 100);
  }

  get contentTypeLabel(): string {
    return this.currentView === 'articles' ? 'Articles' : 'Ads';
  }

  get contentTypeEmoji(): string {
    return this.currentView === 'articles' ? '📰' : '📢';
  }
}
