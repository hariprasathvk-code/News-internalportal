// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ArticleDetail } from '../../../core/models/article-detail.model';

// @Component({
//   selector: 'app-article-row',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './article-row.component.html',
//   styleUrls: ['./article-row.component.scss']
// })
// export class ArticleRowComponent {
//   @Input() article!: ArticleDetail;
//   @Output() approve = new EventEmitter<ArticleDetail>();

//   editMode = false;

//   approveArticle(article: ArticleDetail) {
//     this.approve.emit(article);
//   }

//   isImage(url: string): boolean {
//     return /\.(jpg|jpeg|png|gif|webp)$/i.test(url.split('?')[0]);
//   }

//   isVideo(url: string): boolean {
//     return /\.(mp4|mov|webm|ogg)$/i.test(url.split('?')[0]);
//   }
// }
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
  @Output() save = new EventEmitter<ArticleDetail>(); // Add this

  editMode = false;

  approveArticle(article: ArticleDetail) {
    this.approve.emit(article);
  }

  saveEdit() {
    this.save.emit(this.article);   // Emit the full article to parent
    this.editMode = false;
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url.split('?')[0]);
  }
  isVideo(url: string): boolean {
    return /\.(mp4|mov|webm|ogg)$/i.test(url.split('?')[0]);
  }
}
