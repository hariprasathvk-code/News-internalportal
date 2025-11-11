// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { UserManagementService, Journalist, CreateJournalistRequest } from '../../../core/services/user-management.service';

// @Component({
//   selector: 'app-user-management',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './user-management.component.html',
//   styleUrls: ['./user-management.component.scss']
// })
// export class UserManagementComponent implements OnInit {
//   private userManagementService = inject(UserManagementService);

//   journalists: Journalist[] = []; // ✅ FIXED: Initialize as empty array
//   isLoading = false;
//   showAddForm = false;
//   editingJournalist: Journalist | null = null;

//   // Form data
//   newJournalist: CreateJournalistRequest = {
//     EditorId: '',
//     Email: '',
//     FullName: '',
//     PhoneNumber: '',
//     UserRole: 'Journalist'
//   };

//   // For displaying generated password
//   generatedPassword = '';
//   showPasswordModal = false;

//   ngOnInit() {
//     this.loadEditorId();
//     this.loadJournalists();
//   }

//   private loadEditorId() {
//     const userData = localStorage.getItem('userData');
//     if (userData) {
//       const user = JSON.parse(userData);
//       this.newJournalist.EditorId = user.UserId || 'user-editor-1';
//     }
//   }

//   loadJournalists() {
//     this.isLoading = true;
//     const editorId = this.newJournalist.EditorId;

//     this.userManagementService.getJournalists(editorId).subscribe({
//       next: (journalists) => {
//         this.journalists = journalists || []; // ✅ FIXED: Fallback to empty array
//         this.isLoading = false;
//         console.log('✅ Loaded journalists:', journalists);
//       },
//       error: (error) => {
//         console.error('❌ Error loading journalists:', error);
//         this.journalists = []; // ✅ FIXED: Set to empty array on error
//         this.isLoading = false;
//         alert('Failed to load journalists: ' + error.message);
//       }
//     });
//   }

//   toggleAddForm() {
//     this.showAddForm = !this.showAddForm;
//     this.editingJournalist = null;
//     this.resetForm();
//   }

//   createJournalist() {
//     if (!this.validateForm()) {
//       return;
//     }

//     this.isLoading = true;

//     this.userManagementService.createJournalist(this.newJournalist).subscribe({
//       next: (response) => {
//         console.log('✅ Journalist created:', response);
        
//         this.generatedPassword = response.generatedPassword;
//         this.showPasswordModal = true;

//         this.journalists.unshift(response.journalist);
        
//         this.resetForm();
//         this.showAddForm = false;
//         this.isLoading = false;

//         alert(`✅ Journalist created successfully!\n\nGenerated Password: ${response.generatedPassword}\n\nPlease save this password - it won't be shown again.`);
//       },
//       error: (error) => {
//         console.error('❌ Create error:', error);
//         this.isLoading = false;
//         alert('Failed to create journalist: ' + error.message);
//       }
//     });
//   }

//   startEdit(journalist: Journalist) {
//     this.editingJournalist = { ...journalist };
//     this.showAddForm = false;
//   }

//   saveEdit() {
//     if (!this.editingJournalist) return;

//     this.isLoading = true;

//     const updateData = {
//       FullName: this.editingJournalist.FullName,
//       PhoneNumber: this.editingJournalist.PhoneNumber,
//       Email: this.editingJournalist.Email
//     };

//     this.userManagementService.updateJournalist(this.editingJournalist.UserId, updateData).subscribe({
//       next: () => {
//         console.log('✅ Journalist updated');
        
//         const index = this.journalists.findIndex(j => j.UserId === this.editingJournalist!.UserId);
//         if (index !== -1) {
//           this.journalists[index] = { ...this.editingJournalist! };
//         }

//         this.editingJournalist = null;
//         this.isLoading = false;
//         alert('✅ Journalist updated successfully!');
//       },
//       error: (error) => {
//         console.error('❌ Update error:', error);
//         this.isLoading = false;
//         alert('Failed to update journalist: ' + error.message);
//       }
//     });
//   }

//   cancelEdit() {
//     this.editingJournalist = null;
//   }

//   deleteJournalist(journalist: Journalist) {
//     const confirmed = confirm(
//       `🗑️ Delete Journalist?\n\n` +
//       `Name: ${journalist.FullName}\n` +
//       `Email: ${journalist.Email}\n\n` +
//       `This action cannot be undone.`
//     );

//     if (!confirmed) return;

//     this.isLoading = true;

//     this.userManagementService.deleteJournalist(journalist.UserId).subscribe({
//       next: () => {
//         console.log('✅ Journalist deleted');
        
//         this.journalists = this.journalists.filter(j => j.UserId !== journalist.UserId);
        
//         this.isLoading = false;
//         alert('✅ Journalist deleted successfully!');
//       },
//       error: (error) => {
//         console.error('❌ Delete error:', error);
//         this.isLoading = false;
//         alert('Failed to delete journalist: ' + error.message);
//       }
//     });
//   }

//   closePasswordModal() {
//     this.showPasswordModal = false;
//     this.generatedPassword = '';
//   }

//   copyPassword() {
//     navigator.clipboard.writeText(this.generatedPassword);
//     alert('📋 Password copied to clipboard!');
//   }

//   private validateForm(): boolean {
//     if (!this.newJournalist.Email || !this.newJournalist.Email.includes('@')) {
//       alert('❌ Please enter a valid email address');
//       return false;
//     }

//     if (!this.newJournalist.FullName || this.newJournalist.FullName.trim().length < 3) {
//       alert('❌ Please enter a full name (at least 3 characters)');
//       return false;
//     }

//     if (!this.newJournalist.PhoneNumber || this.newJournalist.PhoneNumber.length < 10) {
//       alert('❌ Please enter a valid phone number');
//       return false;
//     }

//     return true;
//   }

//   private resetForm() {
//     this.newJournalist.Email = '';
//     this.newJournalist.FullName = '';
//     this.newJournalist.PhoneNumber = '';
//     this.newJournalist.UserRole = 'Journalist';
//   }
// }


import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManagementService, Journalist, CreateJournalistRequest } from '../../../core/services/user-management.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  private userManagementService = inject(UserManagementService);

  journalists: Journalist[] = [];
  isLoading = false;
  showAddForm = false;
  editingJournalist: Journalist | null = null;

  // Form data
  newJournalist: CreateJournalistRequest = {
    EditorId: '',
    Email: '',
    FullName: '',
    PhoneNumber: '',
    UserRole: 'Journalist'
  };

  // For displaying generated password
  generatedPassword = '';
  showPasswordModal = false;

  // ✅ ADDED: Getter methods for template (prevents errors)
  get totalJournalistCount(): number {
    return this.journalists.length;
  }

  get activeJournalistCount(): number {
    return this.journalists.filter(j => j.UserRole === 'Journalist').length;
  }

  get hasJournalists(): boolean {
    return this.journalists.length > 0;
  }

  ngOnInit() {
    this.loadEditorId();
    this.loadJournalists();
  }

  private loadEditorId() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.newJournalist.EditorId = user.UserId || 'user-editor-1';
        console.log('✅ Editor ID loaded:', this.newJournalist.EditorId);
      } catch (error) {
        console.error('❌ Error parsing userData:', error);
        this.newJournalist.EditorId = 'user-editor-1';
      }
    } else {
      console.warn('⚠️ No userData in localStorage, using fallback');
      this.newJournalist.EditorId = 'user-editor-1';
    }
  }

  loadJournalists() {
    this.isLoading = true;
    const editorId = this.newJournalist.EditorId;

    console.log('📡 Loading journalists for editor:', editorId);

    this.userManagementService.getJournalists(editorId).subscribe({
      next: (journalists) => {
        this.journalists = journalists || [];
        this.isLoading = false;
        console.log('✅ Loaded journalists:', journalists);
      },
      error: (error) => {
        console.error('❌ Error loading journalists:', error);
        this.journalists = [];
        this.isLoading = false;
        alert('Failed to load journalists: ' + (error.message || 'Unknown error'));
      }
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.editingJournalist = null;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  createJournalist() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    console.log('📤 Creating journalist:', this.newJournalist);

    this.userManagementService.createJournalist(this.newJournalist).subscribe({
      next: (response) => {
        console.log('✅ Journalist created:', response);
        
        this.generatedPassword = response.generatedPassword;
        this.showPasswordModal = true;

        // ✅ FIXED: Add to beginning of array safely
        if (response.journalist) {
          this.journalists = [response.journalist, ...this.journalists];
        }
        
        this.resetForm();
        this.showAddForm = false;
        this.isLoading = false;

        alert(
          `✅ Journalist created successfully!\n\n` +
          `Name: ${response.journalist?.FullName}\n` +
          `Email: ${response.journalist?.Email}\n` +
          `Generated Password: ${response.generatedPassword}\n\n` +
          `Please save this password - it won't be shown again.`
        );
      },
      error: (error) => {
        console.error('❌ Create error:', error);
        this.isLoading = false;
        alert('Failed to create journalist: ' + (error.message || 'Unknown error'));
      }
    });
  }

  startEdit(journalist: Journalist) {
    console.log('✏️ Editing journalist:', journalist);
    this.editingJournalist = { ...journalist };
    this.showAddForm = false;
  }

  saveEdit() {
    if (!this.editingJournalist) {
      console.warn('⚠️ No journalist being edited');
      return;
    }

    this.isLoading = true;
    console.log('💾 Saving journalist:', this.editingJournalist);

    const updateData = {
      FullName: this.editingJournalist.FullName,
      PhoneNumber: this.editingJournalist.PhoneNumber,
      Email: this.editingJournalist.Email
    };

    this.userManagementService.updateJournalist(this.editingJournalist.UserId, updateData).subscribe({
      next: (response) => {
        console.log('✅ Journalist updated:', response);
        
        const index = this.journalists.findIndex(j => j.UserId === this.editingJournalist!.UserId);
        if (index !== -1) {
          this.journalists[index] = { ...this.editingJournalist! };
        }

        this.editingJournalist = null;
        this.isLoading = false;
        alert('✅ Journalist updated successfully!');
      },
      error: (error) => {
        console.error('❌ Update error:', error);
        this.isLoading = false;
        alert('Failed to update journalist: ' + (error.message || 'Unknown error'));
      }
    });
  }

  cancelEdit() {
    console.log('❌ Edit cancelled');
    this.editingJournalist = null;
  }

  deleteJournalist(journalist: Journalist) {
    const confirmed = confirm(
      `🗑️ Delete Journalist?\n\n` +
      `Name: ${journalist.FullName}\n` +
      `Email: ${journalist.Email}\n\n` +
      `This action cannot be undone.`
    );

    if (!confirmed) {
      console.log('❌ Delete cancelled');
      return;
    }

    this.isLoading = true;
    console.log('🗑️ Deleting journalist:', journalist.UserId);

    this.userManagementService.deleteJournalist(journalist.UserId).subscribe({
      next: () => {
        console.log('✅ Journalist deleted');
        
        this.journalists = this.journalists.filter(j => j.UserId !== journalist.UserId);
        
        this.isLoading = false;
        alert('✅ Journalist deleted successfully!');
      },
      error: (error) => {
        console.error('❌ Delete error:', error);
        this.isLoading = false;
        alert('Failed to delete journalist: ' + (error.message || 'Unknown error'));
      }
    });
  }

  closePasswordModal() {
    console.log('🔒 Closing password modal');
    this.showPasswordModal = false;
    this.generatedPassword = '';
  }

  copyPassword() {
    if (!this.generatedPassword) {
      console.warn('⚠️ No password to copy');
      return;
    }

    navigator.clipboard.writeText(this.generatedPassword).then(
      () => {
        console.log('✅ Password copied to clipboard');
        alert('📋 Password copied to clipboard!');
      },
      (error) => {
        console.error('❌ Failed to copy password:', error);
        alert('❌ Failed to copy password. Please copy manually.');
      }
    );
  }

  private validateForm(): boolean {
    if (!this.newJournalist.Email || !this.newJournalist.Email.includes('@')) {
      alert('❌ Please enter a valid email address');
      return false;
    }

    if (!this.newJournalist.FullName || this.newJournalist.FullName.trim().length < 3) {
      alert('❌ Please enter a full name (at least 3 characters)');
      return false;
    }

    if (!this.newJournalist.PhoneNumber || this.newJournalist.PhoneNumber.length < 10) {
      alert('❌ Please enter a valid phone number (at least 10 digits)');
      return false;
    }

    if (!this.newJournalist.EditorId) {
      alert('❌ Editor ID is missing. Please reload the page.');
      return false;
    }

    return true;
  }

  private resetForm() {
    const currentEditorId = this.newJournalist.EditorId; // ✅ FIXED: Preserve EditorId
    this.newJournalist = {
      EditorId: currentEditorId,
      Email: '',
      FullName: '',
      PhoneNumber: '',
      UserRole: 'Journalist'
    };
    console.log('🔄 Form reset');
  }
}
