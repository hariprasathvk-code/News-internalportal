import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReportsService, ReportResponse } from '../../core/services/reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  private reportsService = inject(ReportsService);
  private snackBar=inject(MatSnackBar);

  isLoadingSubscription = false;
  isLoadingNews = false;
  isLoadingAd = false;

  subscriptionReport: ReportResponse | null = null;
  newsReport: ReportResponse | null = null;
  adReport: ReportResponse | null = null;

  generateSubscriptionReport() {
    if (this.isLoadingSubscription) return;

    // Show confirmation toast with "Generate" action button
    const snackRef = this.snackBar.open(
      '📊 Generate Subscription Report? Click Generate to proceed.',
      'Generate',
      { duration: 10000 }
    );

    snackRef.onAction().subscribe(() => {
      this.isLoadingSubscription = true;
      this.subscriptionReport = null;

      this.reportsService.generateSubscriptionReport().subscribe({
        next: (response) => {
          this.isLoadingSubscription = false;
          this.subscriptionReport = response;
          console.log('✅ Subscription Report Response:', response);

          if (response.s3Url) {
            this.snackBar.open(
              `✅ Subscription Report Generated! ${response.message || 'Report created successfully'}. File saved to S3. Click Download to retrieve the report.`,
              'Close',
              { duration: 5000 }
            );
          } else {
            this.snackBar.open(
              `✅ Subscription Report Generated! ${response.message || 'Report created successfully'}. Total Records: ${response.totalRecords || 'N/A'}`,
              'Close',
              { duration: 5000 }
            );
          }
        },
        error: (error) => {
          this.isLoadingSubscription = false;
          console.error('❌ Subscription Report Error:', error);
          this.snackBar.open(`❌ Failed to generate Subscription Report: ${error.message}`, 'Close', { duration: 5000 });
        }
      });
    });
  }

  generateNewsReport() {
    if (this.isLoadingNews) return;

    const snackRef = this.snackBar.open(
      '📰 Generate News Report? Click Generate to proceed.',
      'Generate',
      { duration: 10000 }
    );

    snackRef.onAction().subscribe(() => {
      this.isLoadingNews = true;
      this.newsReport = null;

      this.reportsService.generateNewsReport().subscribe({
        next: (response) => {
          this.isLoadingNews = false;
          this.newsReport = response;
          console.log('✅ News Report Response:', response);

          if (response.s3Url) {
            this.snackBar.open(
              `✅ News Report Generated! ${response.message || 'Report created successfully'}. File saved to S3. Click Download to retrieve the report.`,
              'Close',
              { duration: 5000 }
            );
          } else {
            this.snackBar.open(
              `✅ News Report Generated! ${response.message || 'Report created successfully'}. Total Records: ${response.totalRecords || 'N/A'}`,
              'Close',
              { duration: 5000 }
            );
          }
        },
        error: (error) => {
          this.isLoadingNews = false;
          console.error('❌ News Report Error:', error);
          this.snackBar.open(`❌ Failed to generate News Report: ${error.message}`, 'Close', { duration: 5000 });
        }
      });
    });
  }

  generateAdReport() {
    if (this.isLoadingAd) return;

    const snackRef = this.snackBar.open(
      '📢 Generate Ad Report? Click Generate to proceed.',
      'Generate',
      { duration: 10000 }
    );

    snackRef.onAction().subscribe(() => {
      this.isLoadingAd = true;
      this.adReport = null;

      this.reportsService.generateAdReport().subscribe({
        next: (response) => {
          this.isLoadingAd = false;
          this.adReport = response;
          console.log('✅ Ad Report Response:', response);

          if (response.s3Url) {
            this.snackBar.open(
              `✅ Ad Report Generated! ${response.message || 'Report created successfully'}. File saved to S3. Click Download to retrieve the report.`,
              'Close',
              { duration: 5000 }
            );
          } else {
            this.snackBar.open(
              `✅ Ad Report Generated! ${response.message || 'Report created successfully'}. Total Records: ${response.totalRecords || 'N/A'}`,
              'Close',
              { duration: 5000 }
            );
          }
        },
        error: (error) => {
          this.isLoadingAd = false;
          console.error('❌ Ad Report Error:', error);
          this.snackBar.open(`❌ Failed to generate Ad Report: ${error.message}`, 'Close', { duration: 5000 });
        }
      });
    });
  }

  downloadReport(report: ReportResponse, filename: string) {
    console.log('🔍 Download report called');
    console.log('🔍 Report object:', report);

    const s3Url = report.downloadUrl ||
      report.s3Url ||
      report['s3_url'] ||
      report['S3Url'] ||
      report['url'] ||
      report['fileUrl'];

    if (s3Url) {
      console.log('✅ Found download URL:', s3Url);
      this.downloadDirect(s3Url, filename);
    }
    else if (report.data) {
      console.log('⚠️ No S3 URL, using data field');
      const txtContent = this.formatReportAsText(report, filename);
      this.downloadAsFile(txtContent, filename, 'text/plain');
    }
    else {
      console.error('❌ Response structure:', JSON.stringify(report, null, 2));
      this.snackBar.open(
        '❌ Cannot download report. Response does not contain downloadUrl or data field. Check browser console for details.',
        'Close',
        { duration: 5000 }
      );
    }
  }

  private downloadDirect(url: string, filename: string) {
    console.log('📥 Direct download from:', url);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `${filename}-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('✅ Download initiated');
  }

  private downloadFromS3(s3Url: string, filename: string) {
    this.reportsService.downloadFileFromUrl(s3Url).subscribe({
      next: (content) => {
        console.log('✅ Downloaded from S3, size:', content.length);
        this.downloadAsFile(content, filename, 'text/plain');
      },
      error: (error) => {
        console.error('❌ S3 Download error:', error);
        this.snackBar.open(
          '❌ Failed to download from S3 due to CORS. File is being downloaded directly via browser instead.',
          'Close',
          { duration: 5000 }
        );
        this.downloadDirect(s3Url, filename);
      }
    });
  }

  private downloadAsFile(content: string, filename: string, mimeType: string) {
    const dataBlob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private formatReportAsText(report: ReportResponse, reportName: string): string {
    const timestamp = new Date().toLocaleString();
    const separator = '='.repeat(60);

    const reportType = reportName.replace('-report', '').toUpperCase();

    let text = `${separator}\n`;
    text += `           ${reportType} REPORT\n`;
    text += `${separator}\n\n`;

    text += `Generated: ${timestamp}\n`;
    text += `Status: ${report.success ? 'Success' : 'Failed'}\n`;

    if (report.message) {
      text += `Message: ${report.message}\n`;
    }

    if (report.totalRecords !== undefined && report.totalRecords !== null) {
      text += `Total Records: ${report.totalRecords}\n`;
    }

    if (report.generatedAt) {
      text += `Generated At: ${report.generatedAt}\n`;
    }

    text += `\n${separator}\n`;
    text += `                 DATA\n`;
    text += `${separator}\n\n`;

    if (report.data && Object.keys(report.data).length > 0) {
      text += this.formatDataAsText(report.data, 0);
    } else {
      text += 'No data available\n';
    }

    text += `\n${separator}\n`;
    text += `             END OF REPORT\n`;
    text += `${separator}\n`;

    return text;
  }

  private formatDataAsText(data: any, indent: number = 0): string {
    const indentStr = '  '.repeat(indent);
    let text = '';

    if (data === null || data === undefined) {
      return `${indentStr}null\n`;
    }

    if (typeof data !== 'object') {
      return `${indentStr}${data}\n`;
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return `${indentStr}(empty array)\n`;
      }
      data.forEach((item, index) => {
        text += `${indentStr}[${index}]\n`;
        text += this.formatDataAsText(item, indent + 1);
      });
    } else {
      const keys = Object.keys(data);
      if (keys.length === 0) {
        return `${indentStr}(empty object)\n`;
      }

      keys.forEach(key => {
        const value = data[key];

        if (value === null || value === undefined) {
          text += `${indentStr}${key}: null\n`;
        } else if (typeof value === 'object') {
          text += `${indentStr}${key}:\n`;
          text += this.formatDataAsText(value, indent + 1);
        } else {
          text += `${indentStr}${key}: ${value}\n`;
        }
      });
    }

    return text;
  }
}
