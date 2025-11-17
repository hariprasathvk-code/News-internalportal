
// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AdSubmission } from '../../../core/models/ad-submission.model';
// import { AdApiService } from '../../../core/services/ad-api.service'; // Make sure the path matches your project

// @Component({
//   selector: 'app-ad-submission-list',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './ad-submission-list.component.html',
//   styleUrls: ['./ad-submission-list.component.scss']
// })
// export class AdSubmissionListComponent {
//   @Input() ads: AdSubmission[] = [];
//   @Output() checkAi = new EventEmitter<AdSubmission>();

//   editAd: AdSubmission | null = null;
//   saving = false; // For optional spinner/disable

//   constructor(private adApi: AdApiService) {}

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
//     this.saving = true;
//     this.adApi.updateAd(this.editAd.AdId, this.editAd).subscribe({
//       next: () => {
//         const idx = this.ads.findIndex(a => a.AdId === this.editAd!.AdId);
//         if (idx >= 0) {
//           this.ads[idx] = { ...this.editAd! };
//         }
//         this.editAd = null;
//         this.saving = false;
//         // Optionally show a success message/snackbar
//       },
//       error: (err) => {
//         // Optionally notify error
//         this.saving = false;
//       }
//     });
//   }

//   onCheckAi(ad: AdSubmission) {
//     this.checkAi.emit(ad);
//   }
//   approveAd(ad: AdSubmission) {
//     this.saving = true;
//     this.adApi.approveAd(ad.AdId).subscribe({
//       next: () => {
//         ad.Status = 'Approved';
//         this.ads = this.ads.filter(item => item.AdId !== ad.AdId);
//         this.saving = false;
//         alert(`✓ Ad approved successfully: ${ad.Title}`);
//       },
//       error: (err) => {
//         this.saving = false;
//         alert(`❌ Failed to approve ad: ${ad.Title}\n${err.message || err}`);
//       }
//     });
//   }
// rejectAd(ad: AdSubmission) {
//   this.saving = true;
//   this.adApi.rejectAd(ad.AdId).subscribe({
//     next: () => {
//       this.ads = this.ads.filter(item => item.AdId !== ad.AdId);  // Remove from UI after rejection
//       this.saving = false;
//       alert(`✗ Ad rejected: ${ad.Title}`);
//     },
//     error: (err) => {
//       this.saving = false;
//       alert(`❌ Failed to reject ad: ${ad.Title}\n${err.message || err}`);
//     }
//   });
// }

//   cancelEdit() {
//     this.editAd = null;
//   }
// }
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdSubmission } from '../../../core/models/ad-submission.model';
import { AdApiService } from '../../../core/services/ad-api.service';

@Component({
  selector: 'app-ad-submission-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './ad-submission-list.component.html',
  styleUrls: ['./ad-submission-list.component.scss']
})
export class AdSubmissionListComponent {
  @Input() ads: AdSubmission[] = [];
  @Output() checkAi = new EventEmitter<AdSubmission>();

  editAd: AdSubmission | null = null;
  saving = false; // For optional spinner/disable

  private adApi = inject(AdApiService);
  private snackBar = inject(MatSnackBar);

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
        this.snackBar.open('✓ Ad saved successfully', 'Close', { duration: 4000 });
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(`❌ Failed to save ad: ${err.message || err}`, 'Close', { duration: 6000 });
      }
    });
  }

  onCheckAi(ad: AdSubmission) {
    this.checkAi.emit(ad);
  }

  approveAd(ad: AdSubmission) {
    this.saving = true;
    this.adApi.approveAd(ad.AdId).subscribe({
      next: () => {
        ad.Status = 'Approved';
        this.ads = this.ads.filter(item => item.AdId !== ad.AdId);
        this.saving = false;
        this.snackBar.open(`✓ Ad approved successfully: ${ad.Title}`, 'Close', { duration: 5000 });
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(`❌ Failed to approve ad: ${ad.Title}\n${err.message || err}`, 'Close', { duration: 6000 });
      }
    });
  }

  rejectAd(ad: AdSubmission) {
    this.saving = true;
    this.adApi.rejectAd(ad.AdId).subscribe({
      next: () => {
        this.ads = this.ads.filter(item => item.AdId !== ad.AdId);  // Remove from UI after rejection
        this.saving = false;
        this.snackBar.open(`✗ Ad rejected: ${ad.Title}`, 'Close', { duration: 5000 });
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(`❌ Failed to reject ad: ${ad.Title}\n${err.message || err}`, 'Close', { duration: 6000 });
      }
    });
  }

  cancelEdit() {
    this.editAd = null;
  }
}
