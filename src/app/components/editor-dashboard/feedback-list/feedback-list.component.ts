import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feedback } from '../../../core/models/feedback.model';

@Component({
  selector: 'app-feedback-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feedback-container">
      <h2>User Feedbacks</h2>
      <div *ngIf="feedbackList.length === 0" class="no-feedback">
        No feedbacks available.
      </div>
      <div *ngFor="let fb of feedbackList" class="feedback-card">
        <h4>{{ fb.name }} ({{ fb.email }})</h4>
        <p>{{ fb.feedback }}</p>
        <small>Submitted: {{ fb.submittedAt | date:'medium' }}</small>
      </div>
    </div>
  `,
  styles: [`
    .feedback-container {
      padding: 20px;
    }
    .feedback-card {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 15px;
      background: #fafafa;
    }
    .feedback-card h4 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .feedback-card p {
      margin: 10px 0;
      color: #555;
    }
    .feedback-card small {
      color: #999;
    }
    .no-feedback {
      padding: 20px;
      text-align: center;
      color: #999;
    }
  `]
})
export class FeedbackListComponent {
  @Input() feedbacks: Feedback[] = [];

  // Defensive getter to ensure it's always an array
  get feedbackList(): Feedback[] {
    return Array.isArray(this.feedbacks) ? this.feedbacks : [];
  }
}
