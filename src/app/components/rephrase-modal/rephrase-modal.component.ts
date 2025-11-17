import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AiRephraseService, RephraseRequest } from '../../core/services/ai-rephrase.service';
import { NewsApiService } from '../../core/services/news-api.service';

@Component({
  selector: 'app-rephrase-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './rephrase-modal.component.html',
  styleUrls: ['./rephrase-modal.component.scss']
})
export class RephraseModalComponent {
  private aiRephraseService = inject(AiRephraseService);
  private newsApiService = inject(NewsApiService);
  private snackBar=inject(MatSnackBar);

  // Selection state
  rephraseTitle = false;
  rephraseSummary = false;
  rephraseContent = false;

  // Processing state
  isProcessing = false;
  isGenerating = false;
  hasResults = false;

  // Results
  originalTitle = '';
  originalSummary = '';
  originalContent = '';
  improvedTitle = '';
  improvedSummary = '';
  improvedContent = '';

  // Accept/Reject state
  titleAccepted: boolean | null = null;
  summaryAccepted: boolean | null = null;
  contentAccepted: boolean | null = null;

  constructor(
    public dialogRef: MatDialogRef<RephraseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { newsId: string; submittedDate: number; title: string }
  ) {}

  get canGenerate(): boolean {
    return this.rephraseTitle || this.rephraseSummary || this.rephraseContent;
  }

  get hasAcceptedChanges(): boolean {
    return this.titleAccepted === true || 
           this.summaryAccepted === true || 
           this.contentAccepted === true;
  }

  generateImprovements() {
    if (!this.canGenerate) return;

    this.isGenerating = true;
    this.isProcessing = true;

    const request: RephraseRequest = {
      NewsId: this.data.newsId,
      SubmittedDate: this.data.submittedDate,
      RephraseTitle: this.rephraseTitle,
      RephraseSummary: this.rephraseSummary,
      RephraseContent: this.rephraseContent
    };

    console.log('🤖 Generating improvements...', request);

    this.aiRephraseService.rephraseArticle(request).subscribe({
      next: (response) => {
        console.log('✅ Rephrasing complete:', response);

        this.originalTitle = response.data.OriginalTitle;
        this.originalSummary = response.data.OriginalSummary;
        this.originalContent = response.data.OriginalContent;

        if (this.rephraseTitle) {
          this.improvedTitle = response.data.ImprovedTitle || '';
          this.titleAccepted = null;
        }

        if (this.rephraseSummary) {
          this.improvedSummary = response.data.ImprovedSummary || '';
          this.summaryAccepted = null;
        }

        if (this.rephraseContent) {
          this.improvedContent = response.data.ImprovedContent || '';
          this.contentAccepted = null;
        }

        this.hasResults = true;
        this.isGenerating = false;
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('❌ Rephrasing error:', error);
        this.snackBar.open('Failed to generate improvements: ' + (error.error?.message || error.message), 'Close', { duration: 6000 });
        this.isGenerating = false;
        this.isProcessing = false;
      }
    });
  }

  acceptTitle() {
    this.titleAccepted = true;
    console.log('✅ Title accepted');
  }

  rejectTitle() {
    this.titleAccepted = false;
    console.log('❌ Title rejected');
  }

  acceptSummary() {
    this.summaryAccepted = true;
    console.log('✅ Summary accepted');
  }

  rejectSummary() {
    this.summaryAccepted = false;
    console.log('❌ Summary rejected');
  }

  acceptContent() {
    this.contentAccepted = true;
    console.log('✅ Content accepted');
  }

  rejectContent() {
    this.contentAccepted = false;
    console.log('❌ Content rejected');
  }

  confirmChanges() {
    if (!this.hasAcceptedChanges) {
      this.snackBar.open('⚠️ Please accept at least one improvement before confirming.', 'Close', { duration: 5000 });
      return;
    }

    const snackRef = this.snackBar.open(
      'Are you sure you want to apply the accepted changes? This will update the article in the database.',
      'Confirm',
      { duration: 10000 }
    );
 
    snackRef.onAction().subscribe(() => {
    this.isProcessing = true;

    // ✅ FIXED: Prepare update payload with accepted changes
    const updateData: any = {};

    if (this.titleAccepted) {
      updateData.Title = this.improvedTitle;
    }

    if (this.summaryAccepted) {
      updateData.Summary = this.improvedSummary;
    }

    if (this.contentAccepted) {
      updateData.Content = this.improvedContent;
    }

    console.log('💾 Updating article with accepted changes:', updateData);

    // ✅ FIXED: Call the correct method with correct parameters
    this.newsApiService.updateArticleContent(
      this.data.newsId,
      this.data.submittedDate,
      updateData
    ).subscribe({
      next: (response) => {
        console.log('✅ Article updated successfully:', response);
        this.snackBar.open('✅ Article updated successfully with AI improvements!', 'Close', { duration: 6000 });
        this.dialogRef.close({ updated: true, changes: updateData });
      },
      error: (error) => {
        console.error('❌ Update error:', error);
        this.snackBar.open('Failed to update article: ' + (error.error?.message || error.message), 'Close', { duration: 6000 });
        this.isProcessing = false;
      }
    });
    });
  }

  cancel() {
    this.dialogRef.close({ updated: false });
  }
}
