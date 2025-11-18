import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // ✅ ADDED
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ArticleRowComponent } from '../article-row/article-row.component';
import { RephraseModalComponent } from '../../rephrase-modal/rephrase-modal.component'; // ✅ ADDED
import { ArticleDetail } from '../../../core/models/article-detail.model';
import { NewsApiService } from '../../../core/services/news-api.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, ArticleRowComponent, MatDialogModule, MatSnackBarModule], // ✅ ADDED MatDialogModule
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent {
  @Input() articles: ArticleDetail[] = [];
 
  @Output() approveArticle = new EventEmitter<ArticleDetail>();
  @Output() rejectArticle = new EventEmitter<ArticleDetail>();
  @Output() validateArticle = new EventEmitter<ArticleDetail>();
  @Output() updateArticle = new EventEmitter<ArticleDetail>(); // ✅ ADDED

  private snackBar =inject(MatSnackBar);

  constructor(
    private newsApi: NewsApiService,
    private dialog: MatDialog // ✅ ADDED
  ) {}

  onSaveArticle(article: ArticleDetail) {
    this.newsApi.updateArticle(article.NewsId, article).subscribe({
      next: () => {
        console.log('✅ Article saved successfully');
      },
      error: (err) => {
        console.error('❌ Error saving article:', err);
      }
    });
  }

  onValidateWithAI(article: ArticleDetail) {
    this.validateArticle.emit(article);
  }

  onApproveArticle(article: ArticleDetail) {
    this.approveArticle.emit(article);
  }

  onRejectArticle(article: ArticleDetail) {
    this.rejectArticle.emit(article);
  }

  // ✅ NEW: Handle rephrase - opens modal
  onRephraseArticle(article: ArticleDetail) {
    console.log('🤖 Opening rephrase modal for:', article.Title);

    const dialogRef = this.dialog.open(RephraseModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        newsId: article.NewsId,
        submittedDate: article.SubmittedDate,
        title: article.Title
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.updated) {
        console.log('✅ Article was updated with AI improvements');
        console.log('📝 Changes:', result.changes);
        
        // Update the local article object with new content
        if (result.changes.Title) {
          article.Title = result.changes.Title;
        }
        if (result.changes.Summary) {
          article.Summary = result.changes.Summary;
        }
        if (result.changes.Content) {
          article.Content = result.changes.Content;
        }

        // Emit update event to parent (optional)
        this.updateArticle.emit(article);

        this.snackBar.open('✅ Article updated successfully with AI improvements!', 'Close', {
          duration: 4000,
        });
      } else {
        console.log('❌ No changes applied');
      }
    });
  }
}
