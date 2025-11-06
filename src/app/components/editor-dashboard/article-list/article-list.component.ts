import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRowComponent } from '../article-row/article-row.component';
import { ArticleDetail } from '../../../core/models/article-detail.model';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, ArticleRowComponent],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent {
  @Input() articles: ArticleDetail[] = [];
}
