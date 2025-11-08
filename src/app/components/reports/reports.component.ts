import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService, ReportResponse } from '../../core/services/reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  private reportsService = inject(ReportsService);

  isLoadingFinance = false;
  isLoadingUserManagement = false;
  isLoadingHistory = false;

  financeReport: ReportResponse | null = null;
  userManagementReport: ReportResponse | null = null;
  historyReport: ReportResponse | null = null;

  /**
   * Fetch Finance Report
   */
  fetchFinanceReport() {
    if (this.isLoadingFinance) return;

    this.isLoadingFinance = true;
    this.financeReport = null;

    this.reportsService.getFinanceReport().subscribe({
      next: (response) => {
        this.isLoadingFinance = false;
        this.financeReport = response;
        console.log('✅ Finance Report:', response);
        
        alert(
          `💰 Finance Report\n\n` +
          `${response.message || 'Report generated successfully'}`
        );
      },
      error: (error) => {
        this.isLoadingFinance = false;
        console.error('❌ Finance Report Error:', error);
        alert(`❌ Failed to fetch Finance Report: ${error.message}`);
      }
    });
  }

  /**
   * Fetch User Management Report
   */
  fetchUserManagementReport() {
    if (this.isLoadingUserManagement) return;

    this.isLoadingUserManagement = true;
    this.userManagementReport = null;

    this.reportsService.getUserManagementReport().subscribe({
      next: (response) => {
        this.isLoadingUserManagement = false;
        this.userManagementReport = response;
        console.log('✅ User Management Report:', response);
        
        alert(
          `👥 User Management Report\n\n` +
          `${response.message || 'Report generated successfully'}`
        );
      },
      error: (error) => {
        this.isLoadingUserManagement = false;
        console.error('❌ User Management Report Error:', error);
        alert(`❌ Failed to fetch User Management Report: ${error.message}`);
      }
    });
  }

  /**
   * Fetch History Report
   */
  fetchHistoryReport() {
    if (this.isLoadingHistory) return;

    this.isLoadingHistory = true;
    this.historyReport = null;

    this.reportsService.getHistoryReport().subscribe({
      next: (response) => {
        this.isLoadingHistory = false;
        this.historyReport = response;
        console.log('✅ History Report:', response);
        
        alert(
          `📜 History Report\n\n` +
          `${response.message || 'Report generated successfully'}`
        );
      },
      error: (error) => {
        this.isLoadingHistory = false;
        console.error('❌ History Report Error:', error);
        alert(`❌ Failed to fetch History Report: ${error.message}`);
      }
    });
  }
}
