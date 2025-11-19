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
  @Output() reject = new EventEmitter<{ article: ArticleDetail; remark: string }>();
  @Output() validateWithAI = new EventEmitter<ArticleDetail>();
  @Output() save = new EventEmitter<ArticleDetail>();
  @Output() rephrase = new EventEmitter<ArticleDetail>();

  editMode = false;
  isValidating = false;
  isSaving = false;
  isApproving = false;
  isRejecting = false;
  
  isSummaryExpanded = false;
  isContentExpanded = false;

  //  Reject overlay state
  showRejectOverlay = false;
  rejectRemark = '';
  showRemarkError = false;

  approveArticle(article: ArticleDetail) {
    this.isApproving = true;
    this.approve.emit(article);
  }

  // Show reject overlay
  rejectArticle(article: ArticleDetail) {
    this.showRejectOverlay = true;
  }

  //  Confirm rejection with remark
  confirmReject() {
    if (this.rejectRemark.trim().length < 10) {
      this.showRemarkError = true;
      return;
    }

    this.showRemarkError = false;
    this.isRejecting = true;
    this.showRejectOverlay = false;
    
    this.reject.emit({ 
      article: this.article, 
      remark: this.rejectRemark.trim() 
    });
  }

  //  Close overlay
  closeRejectOverlay() {
    this.showRejectOverlay = false;
    this.rejectRemark = '';
    this.showRemarkError = false;
  }

  setActionComplete() {
    this.isApproving = false;
    this.isRejecting = false;
  }

  saveEdit() {
    this.save.emit(this.article);
    this.editMode = false;
  }
  
  checkArticleWithAI(article: ArticleDetail) {
    this.isValidating = true;
    this.validateWithAI.emit(article);
  }

  rephraseArticle(article: ArticleDetail) {
    this.rephrase.emit(article);
  }

  setValidationComplete() {
    this.isValidating = false;
  }

  toggleSummaryExpand() {
    this.isSummaryExpanded = !this.isSummaryExpanded;
  }

  toggleContentExpand() {
    this.isContentExpanded = !this.isContentExpanded;
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url.split('?')[0]);
  }

  isVideo(url: string): boolean {
    return /\.(mp4|mov|webm|ogg)$/i.test(url.split('?')[0]);
  }
}

