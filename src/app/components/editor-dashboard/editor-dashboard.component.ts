import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
 
import { EditorSidebarComponent } from './editor-sidebar/editor-sidebar.component';
import { CardSummaryComponent } from './card-summary/card-summary.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { AdSubmissionListComponent } from './ad-submission-list/ad-submission-list.component';
import { PriorityLifecycleDialogComponent } from './priority-lifecycle-dialog/priority-lifecycle-dialog.component'; // ✅ NEW
 
import { NewsApiService } from '../../core/services/news-api.service';
import { AdApiService } from '../../core/services/ad-api.service';
import { AIValidationService } from '../../core/services/ai-validation.service';
import { ArticleDetail } from '../../core/models/article-detail.model';
import { AdSubmission } from '../../core/models/ad-submission.model';
import { ReportsComponent } from '../reports/reports.component';
import { UserManagementComponent } from './user-management/user-management.component';
 
@Component({
  selector: 'app-editor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatDialogModule, 
    EditorSidebarComponent,
    CardSummaryComponent,
    ArticleListComponent,
    AdSubmissionListComponent,
    UserManagementComponent,
    ReportsComponent
  ],
  templateUrl: './editor-dashboard.component.html',
  styleUrls: ['./editor-dashboard.component.scss']
})
export class EditorDashboardComponent implements OnInit {
  private newsApi = inject(NewsApiService);
  private adApi = inject(AdApiService);
  private aiValidation = inject(AIValidationService);
  private router = inject(Router);
  private dialog = inject(MatDialog); 
 
  articles: ArticleDetail[] = [];
  ads: AdSubmission[] = [];
  selectedSection: string = 'news';
  isValidatingAll = false;
 
  summaryCards = [
    { label: 'Total News', value: 0, note: 'All articles', change: 0 },
    { label: 'Active Ads', value: 0, note: 'Running campaigns', change: 0 },
    { label: 'Pending Reviews', value: 0, note: 'Awaiting approval', change: 0 },
    { label: 'Published Today', value: 0, note: 'Live articles', change: 0 }
  ];

categories = [
  { label: 'Sports', value: 1 },
  { label: 'Politics', value: 2 },
  { label: 'Entertainment', value: 3 },
  { label: 'Defence', value: 4 },
  { label: 'Finance', value: 5 },
  { label: 'Regional', value: 6 }
];

selectedCategory: number | null = null; // Must be a number now!
selectedCategoryNews: any[] = [];
 
  ngOnInit() {
    this.loadSubmittedArticles();
  }
 
onSelectCategory(categoryId: number) {
  if (this.selectedCategory === categoryId) {
    // Collapse news cards on re-click of same category
    this.selectedCategory = null;
    this.selectedCategoryNews = [];
  } else {
    this.selectedCategory = categoryId;
    this.newsApi.getApprovedNewsByCategoryId(categoryId).subscribe({
      next: (res) => this.selectedCategoryNews = res.news || [],
      error: () => this.selectedCategoryNews = []
    });
  }
}

 onSidebarSection(section: string) {
    this.selectedSection = section;
    console.log('📍 Section changed to:', section);

    if (section === 'news') {
      this.loadSubmittedArticles();
    } else if (section === 'ads') {
      this.loadAds();
    }
    else if (section === 'category') {
    this.selectedCategory = null;
    this.selectedCategoryNews = [];
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
  loadCategoryNews(categoryId: number) {
  this.newsApi.getApprovedNewsByCategoryId(categoryId).subscribe({
    next: res => this.selectedCategoryNews = res.news,
    error: () => this.selectedCategoryNews = []
  });
}
 
   checkAllWithAI() {
  if (this.isValidatingAll) {
    return;
  }

  let context = '';
  let count = 0;
  if (this.selectedSection === 'ads') {
    context = 'ads';
    count = this.ads.length;
  } else {
    context = 'news articles';
    count = this.articles.length;
  }

  const confirmed = confirm(
    `🤖 This will validate ALL ${context} using AI.\n\n` +
    `This will automatically process ${count} item(s).\n\nContinue?`
  );

  if (!confirmed) {
    return;
  }

  this.isValidatingAll = true;
  console.log('🤖 Starting AI validation for:', context);

  const serviceCall = 
    this.selectedSection === 'ads'
      ? this.aiValidation.validateAllAds()
      : this.aiValidation.validateAllArticles();

  serviceCall.subscribe({
    next: (response) => {
      this.isValidatingAll = false;
      alert(
        `✅ Batch AI Validation Complete!\n\n` +
        `Processed: ${response.processedCount} ${context}` +
        (response.message ? `\nMessage: ${response.message}` : '')
      );
      if (this.selectedSection === 'ads') {
        this.loadAds();
      } else {
        this.loadSubmittedArticles();
      }
    },
    error: (error) => {
      this.isValidatingAll = false;
      alert(`❌ AI Validation Failed: ${error.error?.message || error.message}`);
    }
  });
}
checkAiValidation(ad: AdSubmission) {
  this.aiValidation.validateSingleAd(ad.AdId).subscribe({
    next: (response) => {
      alert(`AI Validation Result for "${ad.Title}": ${response.message || 'No message'}`);
      this.loadAds(); // optionally reload ads list after validation
    },
    error: (error) => {
      alert(`AI Validation failed: ${error.message}`);
    }
  });
}

  
  onValidateSingleArticle(article: ArticleDetail) {
    console.log('🤖 Validating single article:', article.NewsId);
 
    const confirmed = confirm(
      `🤖 Validate this article with AI?\n\n` +
      `Title: ${article.Title}\n\n` +
      `This will check the content quality and update its status.`
    );
 
    if (!confirmed) {
      return;
    }
 
    this.aiValidation.validateSingleArticle(article.NewsId, article.SubmittedDate).subscribe({
      next: (response) => {
        console.log('✅ Single article validation complete:', response);
       
        alert(
          `✅ AI Validation Complete!\n\n` +
          `Status: ${response.status}\n` +
          `NewsID: ${response.newsId}`
        );
 
        // Reload articles to see updated status
        this.loadSubmittedArticles();
      },
      error: (error) => {
        console.error('❌ Single article validation error:', error);
        alert(`❌ Validation Failed: ${error.error?.message || error.message}`);
      }
    });
  }
 

  onApproveArticle(article: ArticleDetail) {
    console.log('✅ Approve button clicked for:', article.Title);
 
 
    const dialogRef = this.dialog.open(PriorityLifecycleDialogComponent, {
      width: '500px',
      disableClose: true, 
      data: {
        newsId: article.NewsId,
        title: article.Title
      }
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('✅ Priority & Lifecycle values:', result);
        console.log('   - Priority:', result.priority);
        console.log('   - Lifecycle:', result.lifecycle, 'minutes');
        this.approveArticleWithPriority(article, result.priority, result.lifecycle);
      } else {
        console.log('❌ Dialog cancelled - article not approved');
      }
    });
  }
 

  private approveArticleWithPriority(article: ArticleDetail, priority: number, lifecycle: number) {
  console.log('📤 Calling approve API with priority & lifecycle...');
  this.newsApi.approveArticle(article.NewsId, priority, lifecycle).subscribe({
    next: (response) => {
      console.log('✅ Article approved successfully:', response);

      alert(
        `✅ Article Approved Successfully!\n\n` +
        `Title: ${article.Title}\n` +
        `Priority: ${priority}\n` +
        `Lifecycle: ${lifecycle} minutes\n\n`
      );
      this.loadSubmittedArticles();
    },
    error: (error) => {
      console.error('❌ Approve error:', error);
      alert(`❌ Approval Failed: ${error.message}`);
    }
  });
}

  onRejectArticle(article: ArticleDetail) {
    console.log('❌ Rejecting article:', article.NewsId);
 
    const confirmed = confirm(
      `✗ Reject this article?\n\n` +
      `Title: ${article.Title}\n\n` +
      `This will change the status to "Rejected".`
    );
 
    if (!confirmed) return;
 
    this.newsApi.rejectArticle(article.NewsId, article.SubmittedDate).subscribe({
      next: (response) => {
        console.log('✅ Article rejected successfully:', response);
       
        alert(`✓ Article Rejected\n\nTitle: ${article.Title}`);
        this.loadSubmittedArticles();
      },
      error: (error) => {
        console.error('❌ Reject error:', error);
        alert(`❌ Rejection Failed: ${error.message}`);
      }
    });
  }
 
  logout() {
    console.log('🚪 Logging out...');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  isImage(url: string): boolean {
  if (!url) return false;
  const parts = url.split('.');
  const ext = parts.length > 1 ? parts.pop()?.split('?')[0].toLowerCase() : '';
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
}


isVideo(url: string): boolean {
  return url ? /\.(mp4|mov|webm|ogg)$/i.test(url.split('?')[0]) : false;
}
onImageError(event: any) {
  event.target.src = 'assets/img/no-image.png'; 
}

}
 