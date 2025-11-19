import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AIInsightsComponent } from './ai-insights/ai-insights.component';
import { EditorSidebarComponent } from './editor-sidebar/editor-sidebar.component';
import { CardSummaryComponent } from './card-summary/card-summary.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { AdSubmissionListComponent } from './ad-submission-list/ad-submission-list.component';
import { PriorityLifecycleDialogComponent } from './priority-lifecycle-dialog/priority-lifecycle-dialog.component';
 
import { NewsApiService } from '../../core/services/news-api.service';
import { AdApiService } from '../../core/services/ad-api.service';
import { AIValidationService } from '../../core/services/ai-validation.service';
import { ArticleDetail } from '../../core/models/article-detail.model';
import { AdSubmission } from '../../core/models/ad-submission.model';
import { ReportsComponent } from '../reports/reports.component';
import { UserManagementComponent } from './user-management/user-management.component';

import { LeaderboardApiService } from '../../core/services/leaderboard-api.service';
import { LeaderboardResponse } from '../../core/models/leaderboard.model';
import { LeaderboardComponent } from '../../components/editor-dashboard/leaderboard/leaderboard.component';
import { FeedbackApiService } from '../../core/services/feedback-api.service';
import { Feedback } from '../../core/models/feedback.model';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
 
@Component({
  selector: 'app-editor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatDialogModule, 
    MatSnackBarModule,
    EditorSidebarComponent,
    CardSummaryComponent,
    ArticleListComponent,
    AdSubmissionListComponent,
    UserManagementComponent,
    ReportsComponent,
    AIInsightsComponent,
    LeaderboardComponent,
    FeedbackListComponent
    
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
  private snackBar = inject(MatSnackBar);
  private leaderboardApi = inject(LeaderboardApiService);
  private feedbackApi = inject(FeedbackApiService);

  articles: ArticleDetail[] = [];
  ads: AdSubmission[] = [];
  leaderboard: LeaderboardResponse | null = null;
  feedbacks: Feedback[] = [];
  feedbackLoading: boolean = false;
  selectedSection: string = 'news';
  isValidatingAll = false;
 
  summaryCards = [
    { label: 'Total News', value: 0, note: 'All articles', change: 0 },
    { label: 'Active Ads', value: 0, note: 'Running campaigns', change: 0 },
    { label: 'Pending Reviews', value: 0, note: 'Awaiting approval', change: 0 },
    //{ label: 'Published Today', value: 0, note: 'Live articles', change: 0 }
  ];

  categories = [
    { label: 'Sports', value: 1 },
    { label: 'Politics', value: 2 },
    { label: 'Entertainment', value: 3 },
    { label: 'Defence', value: 4 },
    { label: 'Finance', value: 5 },
    { label: 'Regional', value: 6 }
  ];

  selectedCategory: number | null = null;
  selectedCategoryNews: any[] = [];
  rejectedArticles: ArticleDetail[] = [];
   isLoadingRejected = false; 
 
  ngOnInit() {
    this.loadSubmittedArticles();
  }
 
  onSelectCategory(categoryId: number) {
    if (this.selectedCategory === categoryId) {
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
    

    if (section === 'news') {
      this.loadSubmittedArticles();
    } else if (section === 'ads') {
      this.loadAds();
    } else if (section === 'rejected') {  
    this.loadRejectedArticles();
    }
    else if (section === 'feedback') {
        this.loadFeedbacks();
      }
      else if(section === 'leaderboard') {
        this.loadLeaderboard();
      }
    
    else if (section === 'category') {
      this.selectedCategory = null;
      this.selectedCategoryNews = [];
    }
  }

  loadFeedbacks() {
    this.feedbackLoading = true;
    this.feedbackApi.getAllFeedbacks().subscribe({
      next: (data) => {
        
        this.feedbacks = Array.isArray(data) ? data : [];
        this.feedbackLoading = false;
        
      },
      error: (err) => {
        //console.error('Failed to load feedbacks', err);
        this.feedbacks = [];
        this.feedbackLoading = false;
      }
    });
  }

 leaderboardLoading = false;

loadLeaderboard() {
  
  this.leaderboardLoading = true;
  this.leaderboardApi.getLeaderboard().subscribe({
    next: (data) => {
      this.leaderboard = data;
      this.leaderboardLoading = false;
    },
    error: (err) => {
      //console.error('Leaderboard fetch error:', err);
      this.leaderboard = null;
      this.leaderboardLoading = false;
    }
  });
}



  loadAds() {
    this.adApi.getAds().subscribe({
      next: (data) => {
        
        this.ads = data;
        this.summaryCards[1].value = data.length || 0;
      },
      error: (error) => {
        console.error('❌ Error loading ads:', error);
      }
    });
  }
 

  loadSubmittedArticles() {
    this.newsApi.getSubmittedArticles().subscribe({
      next: (data) => {
        
        this.articles = data;
        
        
        this.updateSummaryCards(data);
      },
      error: (error) => {
        console.error('❌ Error loading articles:', error);
      }
    });
  }

  
  updateSummaryCards(articles: ArticleDetail[]) {
    
    this.summaryCards[0].value = articles.length || 0;

    
    const pendingCount = articles.filter(a => 
      a.Status === 'Submitted' || 
      a.Status === 'submitted' || 
      !a.Status
    ).length;
    this.summaryCards[2].value = pendingCount;

    // Published Today (articles approved today)
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // const publishedTodayCount = articles.filter(a => {
    //   if (!a.ApprovedDate) return false;
    //   const approvedDate = new Date(a.ApprovedDate);
    //   approvedDate.setHours(0, 0, 0, 0);
    //   return approvedDate.getTime() === today.getTime() && 
    //          (a.Status === 'Approved' || a.Status === 'approved');
    // }).length;
    // this.summaryCards[3].value = publishedTodayCount;

    // console.log('📊 Summary updated:', {
    //   total: this.summaryCards[0].value,
    //   pending: this.summaryCards[2].value,
    //   //publishedToday: this.summaryCards[3].value
    // });
  }

  
  loadRejectedArticles() {
    this.isLoadingRejected = true;
    
    this.newsApi.getRejectedArticles().subscribe({
      next: (data) => {
        
        this.rejectedArticles = data;
        
        this.isLoadingRejected = false;
      },
      error: (error) => {
        //console.error('❌ Error loading rejected articles:', error);
        this.isLoadingRejected = false;
        this.snackBar.open('❌ Failed to load rejected articles', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  
  
  loadCategoryNews(categoryId: number) {
  this.newsApi.getApprovedNewsByCategoryId(categoryId).subscribe({
    next: res => this.selectedCategoryNews = res.news,
    error: () => this.selectedCategoryNews = []
  });
}

getCategoryLabel(id: number): string {
  const cat = this.categories.find(c => c.value === id);
  return cat ? cat.label : '';
}


 
  checkAllWithAI() {
    if (this.isValidatingAll) { return; }
 
    let context = '';
    let count = 0;
    if (this.selectedSection === 'ads') {
      context = 'ads';
      count = this.ads.length;
    } else {
      context = 'news articles';
      count = this.articles.length;
    }
 
    const snackRef = this.snackBar.open(
      `🤖 Validate ALL ${context}? Processing ${count} items.`, 'Confirm', { duration: 10000 }
    );
 
    snackRef.onAction().subscribe(() => {
      this.isValidatingAll = true;
     
 
      const serviceCall =
        this.selectedSection === 'ads'
          ? this.aiValidation.validateAllAds()
          : this.aiValidation.validateAllArticles();
 
      serviceCall.subscribe({
        next: (response) => {
          this.isValidatingAll = false;
          this.snackBar.open(`
            ✅ Batch AI Validation Complete! Processed: ${response.processedCount} ${context}
            ${response.message ? '\nMessage: ' + response.message : ''}
          `, 'Close', { duration: 6000 });
 
          if (this.selectedSection === 'ads') {
            this.loadAds();
          } else {
            this.loadSubmittedArticles();
          }
        },
        error: (error) => {
          this.isValidatingAll = false;
          this.snackBar.open(`❌ AI Validation Failed`, 'Close', { duration: 6000 });
        }
      });
    });
  }
 
  checkAiValidation(ad: AdSubmission) {
    this.aiValidation.validateSingleAd(ad.AdId).subscribe({
      next: (response) => {
        this.snackBar.open(`AI Validation Result for "${ad.Title}": ${response.message || 'No message'}`, 'Close', { duration: 5000 });
        this.loadAds();
      },
      error: (error) => {
        this.snackBar.open(`AI Validation failed: ${error.message}`, 'Close', { duration: 5000 });
      }
    });
  }
 
  onValidateSingleArticle(article: ArticleDetail) {
    
 
    const snackRef = this.snackBar.open(
      `🤖 Validate this article with AI?\nTitle: ${article.Title}\nCheck content quality and update status.`,
      'Confirm',
      { duration: 10000 }
    );
 
    snackRef.onAction().subscribe(() => {
      this.aiValidation.validateSingleArticle(article.NewsId, article.SubmittedDate).subscribe({
        next: (response) => {
          
          this.snackBar.open(`
            ✅ AI Validation Complete!
            Status: ${response.status}
            NewsID: ${response.newsId}
          `, 'Close', { duration: 6000 });
          this.loadSubmittedArticles();
        },
        error: (error) => {
          //console.error('❌ Single article validation error:', error);
          this.snackBar.open(`❌ Validation Failed:`, 'Close', { duration: 6000 });
        }
      });
    });
  }
 
  onApproveArticle(article: ArticleDetail) {
    
 
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
        
        this.approveArticleWithPriority(article, result.priority, result.lifecycle);
      } else {
        console.log(' Dialog cancelled - article not approved');
      }
    });
  }
 

private approveArticleWithPriority(article: ArticleDetail, priority: number, lifecycle: number) {
  
  this.newsApi.approveArticle(article.NewsId, priority, lifecycle).subscribe({
    next: (response) => {
      
      this.articles = this.articles.filter(a => a.NewsId !== article.NewsId);
      this.updateSummaryCards(this.articles);

      
      this.snackBar.open(
        `✅ Article Approved Successfully!
        Title: ${article.Title}
        Priority: ${priority}
        Lifecycle: ${lifecycle} minutes`,
        'Close', { duration: 6000 }
      );

      
      this.newsApi.updateAuditStatus(article.NewsId, 'Approved').subscribe({
        next: () => {
          this.snackBar.open(
            `✅ Audit record updated!`, 
            'Close', { duration: 4000 }
          );
          
          this.loadSubmittedArticles();
        },
        error: () => {
          this.snackBar.open(
            `✅ Article Approved, ❌ Audit Table NOT updated!`, 
            'Close', { duration: 4000 }
          );
          
          this.loadSubmittedArticles();
        }
      });
    },
    error: (error) => {
      //console.error('❌ Approve error:', error);
      this.snackBar.open(`❌ Approval Failed`, 'Close', { duration: 6000 });
    }
  });
}

 


 
  
  // ✅ ADD THIS METHOD HERE
  // onRejectArticle(data: { article: ArticleDetail; remark: string }) {
  //   console.log('🗑️ Rejecting article:', data.article.NewsId);
  //   console.log('📝 Rejection remark:', data.remark);

  //   this.newsApi.rejectArticle(
  //     data.article.NewsId, 
  //     data.article.SubmittedDate, 
  //     data.remark
  //   ).subscribe({
  //     next: (response) => {
  //       console.log('✅ Article rejected:', response);
        
  //       this.articles = this.articles.filter(a => a.NewsId !== data.article.NewsId);
        
  //       this.snackBar.open(
  //         `✅ Article "${data.article.Title}" rejected successfully`, 
  //         'Close', 
  //         {
  //           duration: 5000,
  //           horizontalPosition: 'center',
  //           verticalPosition: 'bottom',
  //           panelClass: ['success-snackbar']
  //         }
  //       );
        
  //       this.loadSubmittedArticles();
  //     },
  //     error: (error) => {
  //       console.error('❌ Reject error:', error);
  //       this.snackBar.open(
  //         `❌ Rejection Failed: `, 
  //         'Close', 
  //         {
  //           duration: 7000,
  //           horizontalPosition: 'center',
  //           verticalPosition: 'bottom',
  //           panelClass: ['error-snackbar']
  //         }
  //       );
  //     }
  //   });
  // }

  onRejectArticle(data: { article: ArticleDetail; remark: string }) {
  

  this.newsApi.rejectArticle(
    data.article.NewsId, 
    data.article.SubmittedDate, 
    data.remark
  ).subscribe({
    next: (response) => {
      
      this.articles = this.articles.filter(a => a.NewsId !== data.article.NewsId);

      
      this.snackBar.open(
        `✅ Article "${data.article.Title}" rejected successfully`, 
        'Close', 
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar']
        }
      );

      
      this.newsApi.updateAuditStatus(data.article.NewsId, 'Rejected').subscribe({
        next: () => {
          this.snackBar.open(
            `🗑️ Audit record updated for rejection!`,
            'Close',
            { duration: 4000 }
          );
          
          this.loadSubmittedArticles();
        },
        error: () => {
          this.snackBar.open(
            `🗑️ Article Rejected, ❌ Audit Table NOT updated!`,
            'Close',
            { duration: 4000 }
          );
         
          this.loadSubmittedArticles();
        }
      });
    },
    error: (error) => {
      //console.error('❌ Reject error:', error);
      this.snackBar.open(
        `❌ Rejection Failed: `,
        'Close',
        {
          duration: 7000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        }
      );
    }
  });
}

 
  logout() {
    
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
