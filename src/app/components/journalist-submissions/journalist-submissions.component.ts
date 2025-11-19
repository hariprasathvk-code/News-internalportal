import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NewsService } from '../../core/services/news.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ArticleDetail } from '../../core/models/article-detail.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-journalist-submissions',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatProgressSpinnerModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './journalist-submissions.component.html',
  styleUrls: ['./journalist-submissions.component.scss']
})
export class JournalistSubmissionsComponent implements OnInit {
  articles: any[] = [];
  pagedArticles: any[] = [];
  loading = false;
  errorMessage = '';
  user: User | null = null;

  page = 1;
  pageSize = 2;
  totalPages = 1;

  expandedSummary: { [newsId: string]: boolean } = {};
  expandedContent: { [newsId: string]: boolean } = {};

  // Make sure these are public!
  editingArticleId: string | null = null;
  savingArticleId: string | null = null;

  constructor(
    private newsService: NewsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user?.FullName) {
      this.loading = true;
      this.newsService.getAuthorAuditSubmissions(this.user.FullName).subscribe({
        next: data => {
          this.articles = data;
          this.totalPages = Math.ceil(this.articles.length / this.pageSize) || 1;
          this.setPage(1);
          this.loading = false;
        },
        error: err => {
          this.errorMessage = 'Failed to fetch submissions';
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'User not found!';
    }
  }

  setPage(page: number) {
    this.page = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedArticles = this.articles.slice(start, end);
  }

  prevPage() {
    if (this.page > 1) this.setPage(this.page - 1);
  }

  nextPage() {
    if (this.page < this.totalPages) this.setPage(this.page + 1);
  }

  goBack() {
    this.router.navigate(['/journalist-dashboard']);
  }

  toggleSummary(article: any): void {
    this.expandedSummary[article.NewsId] = !this.expandedSummary[article.NewsId];
  }

  toggleContent(article: any): void {
    this.expandedContent[article.NewsId] = !this.expandedContent[article.NewsId];
  }

  onEditClick(article: any) {
    this.editingArticleId = article.NewsId;
  }

  isEditingArticle(article: any): boolean {
    return this.editingArticleId === article.NewsId;
  }

  saveArticle(article: ArticleDetail) {
    this.savingArticleId = article.NewsId;
    forkJoin([
      this.newsService.updateArticle(article.NewsId, article),
      this.newsService.updateArticleContentNewTable(
        article.NewsId,
        article.SubmittedDate,
        {
          Title: article.Title,
          Summary: article.Summary,
          Content: article.Content,
          Status: article.Status
        }
      )
    ]).subscribe({
      next: ([res1, res2]) => {
        this.savingArticleId = null;
        this.editingArticleId = null; // This line ensures the editor hides immediately!
        // Optionally: Update articles list here if needed for fresh values!
      },
      error: err => {
        this.savingArticleId = null;
        // Optionally display error
      }
    });
  }

  cancelEdit() {
    this.editingArticleId = null;
  }
}
