import { Component, Input, Output, EventEmitter, inject, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ArticleRowComponent } from '../article-row/article-row.component';
import { RephraseModalComponent } from '../../rephrase-modal/rephrase-modal.component';
import { ArticleDetail } from '../../../core/models/article-detail.model';
import { NewsApiService } from '../../../core/services/news-api.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, ArticleRowComponent, MatDialogModule, MatSnackBarModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent {
  @Input() articles: ArticleDetail[] = [];
  @ViewChildren(ArticleRowComponent) articleRows!: QueryList<ArticleRowComponent>;
  
  @Output() approveArticle = new EventEmitter<ArticleDetail>();
@Output() rejectArticle = new EventEmitter<{ article: ArticleDetail; remark: string }>(); 
  @Output() validateArticle = new EventEmitter<ArticleDetail>();
  @Output() updateArticle = new EventEmitter<ArticleDetail>();

  private snackBar = inject(MatSnackBar);

  constructor(
    private newsApi: NewsApiService,
    private dialog: MatDialog
  ) {}

  onSaveArticle(article: ArticleDetail) {
    this.newsApi.updateArticle(article.NewsId, article).subscribe({
      next: () => {
        
        this.snackBar.open('✅ Article saved successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        //console.error('❌ Error saving article:', err);
        this.snackBar.open('❌ Failed to save article', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onValidateWithAI(article: ArticleDetail) {
    this.validateArticle.emit(article);
  }

  onApproveArticle(article: ArticleDetail) {
    this.approveArticle.emit(article);
  }

  //  Handle rejection with remark
  onRejectArticle(data: { article: ArticleDetail; remark: string }) {

    this.newsApi.rejectArticle(
      data.article.NewsId, 
      data.article.SubmittedDate, 
      data.remark
    ).subscribe({
      next: (response) => {
        
        // Remove from list
        this.articles = this.articles.filter(a => a.NewsId !== data.article.NewsId);
        
        this.snackBar.open(`✅ Article rejected successfully`, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        // Reset state
        const articleRow = this.articleRows.find(row => row.article.NewsId === data.article.NewsId);
        if (articleRow) {
          articleRow.setActionComplete();
        }
      },
      error: (error) => {
        
        this.snackBar.open('❌ Failed to reject article', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });

        // Reset state
        const articleRow = this.articleRows.find(row => row.article.NewsId === data.article.NewsId);
        if (articleRow) {
          articleRow.setActionComplete();
        }
      }
    });
  }

  onRephraseArticle(article: ArticleDetail) {
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
        
        
        if (result.changes.Title) {
          article.Title = result.changes.Title;
        }
        if (result.changes.Summary) {
          article.Summary = result.changes.Summary;
        }
        if (result.changes.Content) {
          article.Content = result.changes.Content;
        }

        this.updateArticle.emit(article);

        this.snackBar.open('✅ Article updated successfully with AI improvements!', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      } else {
        console.log('❌ No changes applied');
      }
    });
  }
}
