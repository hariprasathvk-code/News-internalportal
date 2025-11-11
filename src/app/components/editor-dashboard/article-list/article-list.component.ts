import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRowComponent } from '../article-row/article-row.component';
import { ArticleDetail } from '../../../core/models/article-detail.model';
import { NewsApiService } from '../../../core/services/news-api.service'; 

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, ArticleRowComponent],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent {
  @Input() articles: ArticleDetail[] = [];
  
  
   constructor(private newsApi: NewsApiService) {}

  onSaveArticle(article: ArticleDetail) {
    this.newsApi.updateArticle(article.NewsId, article).subscribe({
      next: () => {
        // Optionally show a success message/snackbar here
      },
      error: (err) => {
        // Optionally show error message
      }
    });
  }
  // ✅ NEW: Forward AI validation event to parent
   @Output() approveArticle = new EventEmitter<ArticleDetail>(); // ✅ NEW
  @Output() rejectArticle = new EventEmitter<ArticleDetail>(); // ✅ NEW
  @Output() validateArticle = new EventEmitter<ArticleDetail>();
  

  onValidateWithAI(article: ArticleDetail) {
    this.validateArticle.emit(article);
  }

  // ✅ NEW: Forward approve event
  onApproveArticle(article: ArticleDetail) {
    this.approveArticle.emit(article);
  }

  // ✅ NEW: Forward reject event
  onRejectArticle(article: ArticleDetail) {
    this.rejectArticle.emit(article);
  }
}

