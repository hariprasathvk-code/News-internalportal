import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-summary.component.html',
  styleUrls: ['./card-summary.component.scss']
})
export class CardSummaryComponent {
  // ✅ OLD: Individual properties (keep these for backward compatibility)
  @Input() label!: string;
  @Input() value!: number;
  @Input() note = '';
  @Input() change!: number;
  @Input() cards: any[] = [];
}

