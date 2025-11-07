// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AdSubmission } from '../../../core/models/ad-submission.model';

// @Component({
//   selector: 'app-ad-submission-list',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './ad-submission-list.component.html',
//   styleUrls: ['./ad-submission-list.component.scss']
// })
// export class AdSubmissionListComponent {
//   @Input() ads: AdSubmission[] = [];

//   editAd: AdSubmission | null = null;

//   isImage(url: string): boolean {
//     return /\.(jpg|jpeg|png|gif|webp)$/i.test((url ?? '').split('?')[0]);
//   }

//   isVideo(url: string): boolean {
//     return /\.(mp4|mov|webm|ogg)$/i.test((url ?? '').split('?')[0]);
//   }

//   startEdit(ad: AdSubmission) {
//     this.editAd = { ...ad };
//   }

//   saveEdit() {
//     if (!this.editAd) return;
//     const idx = this.ads.findIndex(a => a.AdId === this.editAd!.AdId);
//     if (idx >= 0) {
//       this.ads[idx] = { ...this.editAd };
//     }
//     this.editAd = null;
//   }

//   approveAd(ad: AdSubmission) {
//     alert(`✓ Approved ad: ${ad.Title}`);
//   }

//   cancelEdit() {
//     this.editAd = null;
//   }
// }
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdSubmission } from '../../../core/models/ad-submission.model';
import { AdApiService } from '../../../core/services/ad-api.service'; // Make sure the path matches your project

@Component({
  selector: 'app-ad-submission-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ad-submission-list.component.html',
  styleUrls: ['./ad-submission-list.component.scss']
})
export class AdSubmissionListComponent {
  @Input() ads: AdSubmission[] = [];

  editAd: AdSubmission | null = null;
  saving = false; // For optional spinner/disable

  constructor(private adApi: AdApiService) {}

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test((url ?? '').split('?')[0]);
  }

  isVideo(url: string): boolean {
    return /\.(mp4|mov|webm|ogg)$/i.test((url ?? '').split('?')[0]);
  }

  startEdit(ad: AdSubmission) {
    this.editAd = { ...ad };
  }

  saveEdit() {
    if (!this.editAd) return;
    this.saving = true;
    this.adApi.updateAd(this.editAd.AdId, this.editAd).subscribe({
      next: () => {
        const idx = this.ads.findIndex(a => a.AdId === this.editAd!.AdId);
        if (idx >= 0) {
          this.ads[idx] = { ...this.editAd! };
        }
        this.editAd = null;
        this.saving = false;
        // Optionally show a success message/snackbar
      },
      error: (err) => {
        // Optionally notify error
        this.saving = false;
      }
    });
  }

  approveAd(ad: AdSubmission) {
    // Add approve API call here if needed (not implemented, placeholder)
    alert(`✓ Approved ad: ${ad.Title}`);
  }

  cancelEdit() {
    this.editAd = null;
  }
}
