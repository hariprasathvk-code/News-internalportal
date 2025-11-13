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
  isValidating = false; 
  isSaving = false;
  isApproving = false; 
  isRejecting = false; 
  isContentExpanded = false;

  toggleContentExpand() {
  this.isContentExpanded = !this.isContentExpanded;
}
  
  approveArticle(article: ArticleDetail) {
    this.approve.emit(article);
  }

  rejectArticle(article: ArticleDetail) {
    this.isRejecting = true;
    this.reject.emit(article);
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
