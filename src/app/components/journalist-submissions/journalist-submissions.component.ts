
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NewsService } from '../../core/services/news.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
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

  savingArticleId: string | null = null;

  // MODAL STATES
  isEditModalOpen = false;
  editingArticleData: any = null;
  editingArticleId: string | null = null;

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
        error: () => {
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
    this.expandedSummary[article.NewsId] =
      !this.expandedSummary[article.NewsId];
  }

  toggleContent(article: any): void {
    this.expandedContent[article.NewsId] =
      !this.expandedContent[article.NewsId];
  }

  // ------------------------------
  //      MODAL EDIT SYSTEM
  // ------------------------------

  openEditModal(article: any) {
    this.editingArticleId = article.NewsId;
    this.editingArticleData = JSON.parse(JSON.stringify(article)); // deep clone
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingArticleData = null;
    this.editingArticleId = null;
  }

  saveArticle() {
  if (!this.editingArticleData) return;

  const updated = this.editingArticleData;
  const id = updated.NewsId;
  if (!id) return;

  this.savingArticleId = id;

  // Find index & keep ORIGINAL so we can revert on error
  const index = this.articles.findIndex(a => a.NewsId === id);
  const original = index > -1 ? JSON.parse(JSON.stringify(this.articles[index])) : null;

  // Optimistically update the list so UI reflects change immediately
  if (index > -1) {
    this.articles[index] = JSON.parse(JSON.stringify(updated));
    this.setPage(this.page); // refresh paged view
  }

  // Close modal immediately for great UX
  this.closeEditModal();

  // Perform API calls (they may take time or even fail)
  forkJoin([
    this.newsService.updateArticle(id, updated),
    this.newsService.updateArticleContentNewTable(
      id,
      updated.SubmittedDate,
      {
        Title: updated.Title,
        Summary: updated.Summary,
        Content: updated.Content,
        Status: updated.Status
      }
    )
  ]).subscribe({
    next: () => {
      // success — nothing else required, UI already updated
      this.savingArticleId = null;
    },
    error: (err) => {
      // revert the optimistic update
      if (index > -1 && original) {
        this.articles[index] = original;
        this.setPage(this.page);
      }

      // reopen modal so user can retry / see server error (optional)
      this.editingArticleData = original ? JSON.parse(JSON.stringify(original)) : null;
      this.editingArticleId = id;
      this.isEditModalOpen = true;

      this.savingArticleId = null;
        console.error('Failed to save article', err);
      alert('Failed to save article. Please try again.');
      
    }
  });
}

}
