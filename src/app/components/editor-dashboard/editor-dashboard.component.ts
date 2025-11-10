// // import { Component, inject, OnInit } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { HttpClientModule } from '@angular/common/http';
// // import { Router } from '@angular/router';

// // import { EditorSidebarComponent } from './editor-sidebar/editor-sidebar.component';
// // import { CardSummaryComponent } from './card-summary/card-summary.component';
// // import { ArticleListComponent } from './article-list/article-list.component';
// // import { AdSubmissionListComponent } from './ad-submission-list/ad-submission-list.component';

// // import { NewsApiService } from '../../core/services/news-api.service';
// // import { AdApiService } from '../../core/services/ad-api.service';
// // import { ArticleDetail } from '../../core/models/article-detail.model';
// // import { AdSubmission } from '../../core/models/ad-submission.model';

// // @Component({
// //   selector: 'app-editor-dashboard',
// //   standalone: true,
// //   imports: [
// //     CommonModule,
// //     HttpClientModule,
// //     EditorSidebarComponent,
// //     CardSummaryComponent,
// //     ArticleListComponent,
// //     AdSubmissionListComponent
// //   ],
// //   templateUrl: './editor-dashboard.component.html',
// //   styleUrls: ['./editor-dashboard.component.scss']
// // })
// // export class EditorDashboardComponent implements OnInit {
// //   private newsApi = inject(NewsApiService);
// //   private adApi = inject(AdApiService);
// //   private router = inject(Router);

// //   articles: ArticleDetail[] = [];
// //   ads: AdSubmission[] = [];
// //   selectedSection = 'news';

// //   summaryCards = [
// //     { label: 'Total News', value: 0, note: 'All articles', change: 0 },
// //     { label: 'Active Ads', value: 0, note: 'Running campaigns', change: 0 },
// //     { label: 'Pending Reviews', value: 0, note: 'Awaiting approval', change: 0 },
// //     { label: 'Published Today', value: 0, note: 'Live articles', change: 0 }
// //   ];

// //   ngOnInit() {
// //     this.loadSubmittedArticles();
// //   }

// //   onSidebarSection(section: string) {
// //     this.selectedSection = section;
// //     console.log('Section changed to:', section);

// //     if (section === 'news') {
// //       this.loadSubmittedArticles();
// //     } else if (section === 'ads') {
// //       this.loadAds();
// //     }
// //   }

// //   loadSubmittedArticles() {
// //     this.newsApi.getSubmittedArticles().subscribe({
// //       next: (data) => {
// //         console.log('📰 Articles loaded:', data);
// //         this.articles = data;
// //         this.summaryCards[0].value = data.length || 0;
// //       },
// //       error: (error) => {
// //         console.error('❌ Error loading articles:', error);
// //       }
// //     });
// //   }

// //   loadAds() {
// //     this.adApi.getAds().subscribe({
// //       next: (data) => {
// //         console.log('📢 Ads loaded:', data);
// //         this.ads = data;
// //         this.summaryCards[1].value = data.length || 0;
// //       },
// //       error: (error) => {
// //         console.error('❌ Error loading ads:', error);
// //       }
// //     });
// //   }

// //   checkWithAI() {
// //     alert("AI");
// //     //this.router.navigate(['/news/validate']);
// //   }

// //   logout() {
// //     localStorage.clear();
// //     this.router.navigate(['/login']);
// //   }
// // }

// import { Component, inject, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { Router } from '@angular/router';

// import { EditorSidebarComponent } from './editor-sidebar/editor-sidebar.component';
// import { CardSummaryComponent } from './card-summary/card-summary.component';
// import { ArticleListComponent } from './article-list/article-list.component';
// import { AdSubmissionListComponent } from './ad-submission-list/ad-submission-list.component';

// import { NewsApiService } from '../../core/services/news-api.service';
// import { AdApiService } from '../../core/services/ad-api.service';
// import { AIValidationService } from '../../core/services/ai-validation.service'; 
// import { ArticleDetail } from '../../core/models/article-detail.model';
// import { AdSubmission } from '../../core/models/ad-submission.model';

// @Component({
//   selector: 'app-editor-dashboard',
//   standalone: true,
//   imports: [
//     CommonModule,
//     HttpClientModule,
//     EditorSidebarComponent,
//     CardSummaryComponent,
//     ArticleListComponent,
//     AdSubmissionListComponent
//   ],
//   templateUrl: './editor-dashboard.component.html',
//   styleUrls: ['./editor-dashboard.component.scss']
// })
// export class EditorDashboardComponent implements OnInit {
//   private newsApi = inject(NewsApiService);
//   private adApi = inject(AdApiService);
//   private aiValidation = inject(AIValidationService); // ✅ NEW
//   private router = inject(Router);

//   articles: ArticleDetail[] = [];
//   ads: AdSubmission[] = [];
//   selectedSection = 'news';
//   isValidating = false; // ✅ NEW - Loading state
//   validationMessage = ''; // ✅ NEW - Success/error message

//   summaryCards = [
//     { label: 'Total News', value: 0, note: 'All articles', change: 0 },
//     { label: 'Active Ads', value: 0, note: 'Running campaigns', change: 0 },
//     { label: 'Pending Reviews', value: 0, note: 'Awaiting approval', change: 0 },
//     { label: 'Published Today', value: 0, note: 'Live articles', change: 0 }
//   ];

//   ngOnInit() {
//     this.loadSubmittedArticles();
//   }

//   onSidebarSection(section: string) {
//     this.selectedSection = section;
//     console.log('Section changed to:', section);

//     if (section === 'news') {
//       this.loadSubmittedArticles();
//     } else if (section === 'ads') {
//       this.loadAds();
//     }
//   }

//   loadSubmittedArticles() {
//     this.newsApi.getSubmittedArticles().subscribe({
//       next: (data) => {
//         console.log('📰 Articles loaded:', data);
//         this.articles = data;
//         this.summaryCards[0].value = data.length || 0;
//       },
//       error: (error) => {
//         console.error('❌ Error loading articles:', error);
//       }
//     });
//   }

//   loadAds() {
//     this.adApi.getAds().subscribe({
//       next: (data) => {
//         console.log('📢 Ads loaded:', data);
//         this.ads = data;
//         this.summaryCards[1].value = data.length || 0;
//       },
//       error: (error) => {
//         console.error('❌ Error loading ads:', error);
//       }
//     });
//   }

//   // ✅ NEW: AI Validation Method
//   checkWithAI() {
//     if (this.isValidating) {
//       return; // Prevent double-clicking
//     }

//     const confirmed = confirm(
//       '🤖 This will validate all submitted articles using AI.\n\n' +
//       'Articles will be automatically approved or rejected based on content quality.\n\n' +
//       'Continue?'
//     );

//     if (!confirmed) {
//       return;
//     }

//     this.isValidating = true;
//     this.validationMessage = '';

//     console.log('🤖 Starting AI validation...');

//     this.aiValidation.validateAllArticles().subscribe({
//       next: (response) => {
//         this.isValidating = false;
        
//         console.log('✅ AI Validation complete:', response);
        
//         this.validationMessage = 
//           `✅ AI Validation Complete!\n\n` +
//           `Processed: ${response.processed} articles\n` +
//           `✓ Approved: ${response.approved}\n` +
//           `✗ Rejected: ${response.rejected}`;

//         alert(this.validationMessage);

//         // Reload articles to see updated statuses
//         this.loadSubmittedArticles();
//       },
//       error: (error) => {
//         this.isValidating = false;
//         console.error('❌ AI Validation error:', error);
        
//         this.validationMessage = `❌ AI Validation Failed: ${error.error?.message || error.message}`;
//         alert(this.validationMessage);
//       }
//     });
//   }

//   logout() {
//     localStorage.clear();
//     this.router.navigate(['/login']);
//   }
// }


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
import { AIValidationService } from '../../core/services/ai-validation.service';
import { ArticleDetail } from '../../core/models/article-detail.model';
import { AdSubmission } from '../../core/models/ad-submission.model';
import { ReportsComponent } from '../reports/reports.component';

@Component({
  selector: 'app-editor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    EditorSidebarComponent,
    CardSummaryComponent,
    ArticleListComponent,
    AdSubmissionListComponent,
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

  articles: ArticleDetail[] = [];
  ads: AdSubmission[] = [];
  selectedSection = 'news';
  isValidatingAll = false;

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

  // ✅ Validate ALL articles
  checkAllWithAI() {
    if (this.isValidatingAll) {
      return;
    }

    const confirmed = confirm(
      '🤖 This will validate ALL submitted articles using AI.\n\n' +
      'Articles will be automatically approved or rejected.\n\n' +
      'Continue?'
    );

    if (!confirmed) {
      return;
    }

    this.isValidatingAll = true;
    console.log('🤖 Starting AI validation for all articles...');

    this.aiValidation.validateAllArticles().subscribe({
      next: (response) => {
        this.isValidatingAll = false;
        console.log('✅ AI Validation complete:', response);
        
        alert(
          `✅ Batch AI Validation Complete!\n\n` +
          `Processed: ${response.processedCount} articles\n` +
          `Message: ${response.message}`
        );

        // Reload articles to see updated statuses
        this.loadSubmittedArticles();
      },
      error: (error) => {
        this.isValidatingAll = false;
        console.error('❌ AI Validation error:', error);
        alert(`❌ AI Validation Failed: ${error.error?.message || error.message}`);
      }
    });
  }

  // ✅ NEW: Validate SINGLE article
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

  // ✅ NEW: Approve article
  onApproveArticle(article: ArticleDetail) {
    console.log('✅ Approving article:', article.NewsId);

    const confirmed = confirm(
      `✓ Approve this article?\n\n` +
      `Title: ${article.Title}\n\n` +
      `This will change the status to "Approved".`
    );

    if (!confirmed) return;

    this.newsApi.approveArticle(article.NewsId, article.SubmittedDate).subscribe({
      next: (response) => {
        console.log('✅ Article approved successfully:', response);
        
        alert(`✅ Article Approved!\n\nTitle: ${article.Title}`);

        // Reload articles to see updated status
        this.loadSubmittedArticles();
      },
      error: (error) => {
        console.error('❌ Approve error:', error);
        alert(`❌ Approval Failed: ${error.message}`);
      }
    });
  }

  // ✅ NEW: Reject article
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

        // Reload articles to see updated status
        this.loadSubmittedArticles();
      },
      error: (error) => {
        console.error('❌ Reject error:', error);
        alert(`❌ Rejection Failed: ${error.message}`);
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
