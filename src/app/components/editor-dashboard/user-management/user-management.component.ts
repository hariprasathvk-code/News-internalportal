import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserManagementService, Journalist, CreateJournalistRequest } from '../../../core/services/user-management.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  private userManagementService = inject(UserManagementService);
  private snackBar = inject(MatSnackBar);

  journalists: Journalist[] = [];
  isLoading = false;
  showAddForm = false;
  editingJournalist: Journalist | null = null;
  selectedUserType: 'Journalist' | 'Advertiser' = 'Journalist';

  editorId: string = '';

  newJournalist: CreateJournalistRequest = {
    EditorId: '',
    Email: '',
    FullName: '',
    PhoneNumber: '',
    UserRole: 'Journalist'
  };

  generatedPassword = '';
  showPasswordModal = false;

  get totalJournalistCount(): number {
    return this.journalists.filter(j => j.UserRole === 'Journalist').length;
  }

  get totalAdvertiserCount(): number {
    return this.journalists.filter(j => j.UserRole === 'Advertiser').length;
  }

  get activeJournalistCount(): number {
    return this.journalists.filter(j => j.UserRole === 'Journalist').length;
  }

  get hasUsers(): boolean {
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
        this.editorId = user.UserId || 'user-editor-1';
        this.newJournalist.EditorId = this.editorId;
        console.log('✅ Editor ID loaded:', this.editorId);
      } catch (error) {
        console.error('❌ Error parsing userData:', error);
        this.editorId = 'user-editor-1';
        this.newJournalist.EditorId = this.editorId;
      }
    } else {
      console.warn('⚠️ No userData in localStorage, using fallback');
      this.editorId = 'user-editor-1';
      this.newJournalist.EditorId = this.editorId;
    }
  }

  loadJournalists() {
    this.isLoading = true;

    this.userManagementService.getJournalists().subscribe({
      next: (users) => {
        this.journalists = users || [];
        this.isLoading = false;
        console.log('✅ Loaded users:', users);
        
        if (users && users.length > 0) {
          this.showSuccessSnackbar(`Loaded ${users.length} user(s)`);
        }
      },
      error: (error) => {
        console.error('❌ Error loading users:', error);
        this.journalists = [];
        this.isLoading = false;
        this.showErrorSnackbar('Failed to load users: ' + (error.message || 'Unknown error'));
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

  setUserType(type: 'Journalist' | 'Advertiser') {
    this.selectedUserType = type;
    this.newJournalist.UserRole = type;
    console.log('📝 User type changed to:', type);
  }

  createJournalist() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.newJournalist.UserRole = this.selectedUserType;
    console.log('📤 Creating user:', this.newJournalist);

    this.userManagementService.createJournalist(this.newJournalist).subscribe({
      next: (response) => {
        console.log('✅ User created:', response);
        
        this.generatedPassword = response.generatedPassword;
        this.showPasswordModal = true;

        if (response.journalist) {
          this.journalists = [response.journalist, ...this.journalists];
        }
        
        this.resetForm();
        this.showAddForm = false;
        this.isLoading = false;

        this.showSuccessSnackbar(`${this.selectedUserType} "${response.journalist?.FullName}" created successfully!`);
      },
      error: (error) => {
        console.error('❌ Create error:', error);
        this.isLoading = false;
        this.showErrorSnackbar('Failed to create user: ' + (error.error?.Message || error.message || 'Unknown error'));
      }
    });
  }

  startEdit(journalist: Journalist) {
    console.log('✏️ Editing user:', journalist);
    this.editingJournalist = { ...journalist };
    this.showAddForm = false;
  }

  saveEdit() {
    if (!this.editingJournalist) {
      console.warn('⚠️ No user being edited');
      return;
    }

    this.isLoading = true;
    console.log('💾 Saving user:', this.editingJournalist);

    const updateData = {
      FullName: this.editingJournalist.FullName,
      PhoneNumber: this.editingJournalist.PhoneNumber,
      UserRole: this.editingJournalist.UserRole
    };

    this.userManagementService.updateJournalist(
      this.editingJournalist.UserId,
      this.editorId,
      updateData
    ).subscribe({
      next: (response) => {
        console.log('✅ User updated:', response);
        
        const index = this.journalists.findIndex(j => j.UserId === this.editingJournalist!.UserId);
        if (index !== -1) {
          this.journalists[index] = { ...this.editingJournalist! };
        }

        this.editingJournalist = null;
        this.isLoading = false;
        
        this.showSuccessSnackbar('User updated successfully!');
      },
      error: (error) => {
        console.error('❌ Update error:', error);
        console.error('❌ Error details:', error.error);
        this.isLoading = false;
        this.showErrorSnackbar('Failed to update user: ' + (error.error?.message || error.message || 'Unknown error'));
      }
    });
  }

  cancelEdit() {
    console.log('❌ Edit cancelled');
    this.editingJournalist = null;
  }

  deleteJournalist(journalist: Journalist) {
    const snackBarRef = this.snackBar.open(
      `🗑️ Delete ${journalist.UserRole} "${journalist.FullName}"?`,
      'Confirm Delete',
      {
        duration: 10000,
        horizontalPosition: 'center', // ✅ CHANGED
        verticalPosition: 'bottom',   // ✅ CHANGED
        panelClass: ['delete-confirm-snackbar']
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this.performDelete(journalist);
    });

    snackBarRef.afterDismissed().subscribe(info => {
      if (!info.dismissedByAction) {
        console.log('❌ Delete cancelled');
        this.showInfoSnackbar('Delete cancelled');
      }
    });
  }

  private performDelete(journalist: Journalist) {
    this.isLoading = true;
    console.log('🗑️ Deleting user:', journalist.UserId);

    this.userManagementService.deleteJournalist(
      journalist.UserId,
      this.editorId,
      journalist.UserRole
    ).subscribe({
      next: () => {
        console.log('✅ User deleted');
        
        this.journalists = this.journalists.filter(j => j.UserId !== journalist.UserId);
        
        this.isLoading = false;
        
        this.showSuccessSnackbar(`User "${journalist.FullName}" deleted successfully`);
      },
      error: (error) => {
        console.error('❌ Delete error:', error);
        console.error('❌ Error details:', error.error);
        this.isLoading = false;
        this.showErrorSnackbar('Failed to delete user: ' + (error.error?.message || error.message || 'Unknown error'));
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
        this.showSuccessSnackbar('📋 Password copied to clipboard!');
      },
      (error) => {
        console.error('❌ Failed to copy password:', error);
        this.showErrorSnackbar('Failed to copy password. Please copy manually.');
      }
    );
  }

  private validateForm(): boolean {
    if (!this.newJournalist.Email || !this.newJournalist.Email.includes('@')) {
      this.showWarningSnackbar('Please enter a valid email address');
      return false;
    }

    if (!this.newJournalist.FullName || this.newJournalist.FullName.trim().length < 3) {
      this.showWarningSnackbar('Please enter a full name (at least 3 characters)');
      return false;
    }

    if (!this.newJournalist.PhoneNumber || this.newJournalist.PhoneNumber.length < 10) {
      this.showWarningSnackbar('Please enter a valid phone number (at least 10 digits)');
      return false;
    }

    if (!this.newJournalist.EditorId) {
      this.showErrorSnackbar('Editor ID is missing. Please reload the page.');
      return false;
    }

    return true;
  }

  private resetForm() {
    const currentEditorId = this.newJournalist.EditorId;
    this.newJournalist = {
      EditorId: currentEditorId,
      Email: '',
      FullName: '',
      PhoneNumber: '',
      UserRole: this.selectedUserType
    };
    console.log('🔄 Form reset');
  }

  // ✅ Updated Snackbar helper methods - ALL BOTTOM CENTER
  private showSuccessSnackbar(message: string) {
    this.snackBar.open('✅ ' + message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center', // ✅ CHANGED
      verticalPosition: 'bottom',   // ✅ CHANGED
      panelClass: ['success-snackbar']
    });
  }

  private showErrorSnackbar(message: string) {
    this.snackBar.open('❌ ' + message, 'Close', {
      duration: 7000,
      horizontalPosition: 'center', // ✅ CHANGED
      verticalPosition: 'bottom',   // ✅ CHANGED
      panelClass: ['error-snackbar']
    });
  }

  private showWarningSnackbar(message: string) {
    this.snackBar.open('⚠️ ' + message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center', // ✅ CHANGED
      verticalPosition: 'bottom',   // ✅ CHANGED
      panelClass: ['warning-snackbar']
    });
  }

  private showInfoSnackbar(message: string) {
    this.snackBar.open('ℹ️ ' + message, 'Close', {
      duration: 4000,
      horizontalPosition: 'center', // ✅ CHANGED
      verticalPosition: 'bottom',   // ✅ CHANGED
      panelClass: ['info-snackbar']
    });
  }
}
