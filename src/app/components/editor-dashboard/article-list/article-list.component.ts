// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ArticleRowComponent } from '../article-row/article-row.component';
// import { ArticleDetail } from '../../../core/models/article-detail.model';

// @Component({
//   selector: 'app-article-list',
//   standalone: true,
//   imports: [CommonModule, ArticleRowComponent],
//   templateUrl: './article-list.component.html',
//   styleUrls: ['./article-list.component.scss']
// })
// export class ArticleListComponent {
//   @Input() articles: ArticleDetail[] = [];
// }
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRowComponent } from '../article-row/article-row.component';
import { ArticleDetail } from '../../../core/models/article-detail.model';
import { NewsApiService } from '../../../core/services/news-api.service'; // Ensure correct path

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
}
