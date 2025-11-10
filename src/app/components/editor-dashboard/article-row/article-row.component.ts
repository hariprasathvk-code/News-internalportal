import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleDetail } from '../../../core/models/article-detail.model';

@Component({
  selector: 'app-article-row',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './article-row.component.html',
  styleUrls: ['./article-row.component.scss']
})
export class ArticleRowComponent {
  @Input() article!: ArticleDetail;
  @Output() approve = new EventEmitter<ArticleDetail>();
  @Output() reject = new EventEmitter<ArticleDetail>();
  @Output() validateWithAI = new EventEmitter<ArticleDetail>(); // ✅ NEW
  @Output() save = new EventEmitter<ArticleDetail>(); // Add this

  editMode = false;
  isValidating = false; // ✅ NEW
  isSaving = false;
  isApproving = false; // ✅ NEW
  isRejecting = false; // ✅ NEW
  
  approveArticle(article: ArticleDetail) {
    this.approve.emit(article);
  }
// ✅ NEW: Reject article
  rejectArticle(article: ArticleDetail) {
    this.isRejecting = true;
    this.reject.emit(article);
  }

  // ✅ Called from parent after approve/reject completes
  setActionComplete() {
    this.isApproving = false;
    this.isRejecting = false;
  }
  saveEdit() {
    this.save.emit(this.article);   // Emit the full article to parent
    this.editMode = false;
  }
  
  // ✅ NEW: Emit event to parent for AI validation
  checkArticleWithAI(article: ArticleDetail) {
    this.isValidating = true;
    this.validateWithAI.emit(article);
  }

  // ✅ Call this from parent after validation completes
  setValidationComplete() {
    this.isValidating = false;
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url.split('?')[0]);
  }

  isVideo(url: string): boolean {
    return /\.(mp4|mov|webm|ogg)$/i.test(url.split('?')[0]);
  }
}
