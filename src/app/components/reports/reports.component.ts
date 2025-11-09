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

  isLoadingSubscription = false;
  isLoadingNews = false;
  isLoadingAd = false;

  subscriptionReport: ReportResponse | null = null;
  newsReport: ReportResponse | null = null;
  adReport: ReportResponse | null = null;

  generateSubscriptionReport() {
    if (this.isLoadingSubscription) return;

    const confirmed = confirm(
      '📊 Generate Subscription Report?\n\n' +
      'This will compile all subscription data and analytics.'
    );

    if (!confirmed) return;

    this.isLoadingSubscription = true;
    this.subscriptionReport = null;

    this.reportsService.generateSubscriptionReport().subscribe({
      next: (response) => {
        this.isLoadingSubscription = false;
        this.subscriptionReport = response;
        console.log('✅ Subscription Report Response:', response);
        
        // ✅ Check if S3 URL is provided
        if (response.s3Url) {
          console.log('📥 S3 URL found:', response.s3Url);
          alert(
            `✅ Subscription Report Generated!\n\n` +
            `${response.message || 'Report created successfully'}\n` +
            `File saved to S3\n\n` +
            `Click Download to retrieve the report.`
          );
        } else {
          alert(
            `✅ Subscription Report Generated!\n\n` +
            `${response.message || 'Report created successfully'}\n` +
            `Total Records: ${response.totalRecords || 'N/A'}`
          );
        }
      },
      error: (error) => {
        this.isLoadingSubscription = false;
        console.error('❌ Subscription Report Error:', error);
        alert(`❌ Failed to generate Subscription Report: ${error.message}`);
      }
    });
  }

  generateNewsReport() {
    if (this.isLoadingNews) return;

    const confirmed = confirm(
      '📰 Generate News Report?\n\n' +
      'This will compile all news articles data and statistics.'
    );

    if (!confirmed) return;

    this.isLoadingNews = true;
    this.newsReport = null;

    this.reportsService.generateNewsReport().subscribe({
      next: (response) => {
        this.isLoadingNews = false;
        this.newsReport = response;
        console.log('✅ News Report Response:', response);
        
        if (response.s3Url) {
          console.log('📥 S3 URL found:', response.s3Url);
          alert(
            `✅ News Report Generated!\n\n` +
            `${response.message || 'Report created successfully'}\n` +
            `File saved to S3\n\n` +
            `Click Download to retrieve the report.`
          );
        } else {
          alert(
            `✅ News Report Generated!\n\n` +
            `${response.message || 'Report created successfully'}\n` +
            `Total Records: ${response.totalRecords || 'N/A'}`
          );
        }
      },
      error: (error) => {
        this.isLoadingNews = false;
        console.error('❌ News Report Error:', error);
        alert(`❌ Failed to generate News Report: ${error.message}`);
      }
    });
  }

  generateAdReport() {
    if (this.isLoadingAd) return;

    const confirmed = confirm(
      '📢 Generate Ad Report?\n\n' +
      'This will compile all advertisement data and performance metrics.'
    );

    if (!confirmed) return;

    this.isLoadingAd = true;
    this.adReport = null;

    this.reportsService.generateAdReport().subscribe({
      next: (response) => {
        this.isLoadingAd = false;
        this.adReport = response;
        console.log('✅ Ad Report Response:', response);
        
        if (response.s3Url) {
          console.log('📥 S3 URL found:', response.s3Url);
          alert(
            `✅ Ad Report Generated!\n\n` +
            `${response.message || 'Report created successfully'}\n` +
            `File saved to S3\n\n` +
            `Click Download to retrieve the report.`
          );
        } else {
          alert(
            `✅ Ad Report Generated!\n\n` +
            `${response.message || 'Report created successfully'}\n` +
            `Total Records: ${response.totalRecords || 'N/A'}`
          );
        }
      },
      error: (error) => {
        this.isLoadingAd = false;
        console.error('❌ Ad Report Error:', error);
        alert(`❌ Failed to generate Ad Report: ${error.message}`);
      }
    });
  }

  /**
 * Download report - handles multiple response formats
 */
downloadReport(report: ReportResponse, filename: string) {
  console.log('🔍 Download report called');
  console.log('🔍 Report object:', report);
  
  // ✅ Check multiple possible field names for S3 URL
  const s3Url = report.downloadUrl ||  
                report.s3Url || 
                report['s3_url'] || 
                report['S3Url'] || 
                report['url'] || 
                report['fileUrl'];
  
  if (s3Url) {
    console.log('✅ Found download URL:', s3Url);
    
    // ✅ OPTION 1: Direct browser download (bypasses CORS)
    this.downloadDirect(s3Url, filename);
    
    // ✅ OPTION 2: Fetch from S3 via HTTP (requires CORS)
    // this.downloadFromS3(s3Url, filename);
  } 
  else if (report.data) {
    console.log('⚠️ No S3 URL, using data field');
    const txtContent = this.formatReportAsText(report, filename);
    this.downloadAsFile(txtContent, filename, 'text/plain');
  } 
  else {
    console.error('❌ Response structure:', JSON.stringify(report, null, 2));
    alert(
      '❌ Cannot download report\n\n' +
      'Response does not contain downloadUrl or data field.\n\n' +
      'Check browser console for details.'
    );
  }
}

/**
 * Download directly by opening URL in browser (bypasses CORS)
 */
private downloadDirect(url: string, filename: string) {
  console.log('📥 Direct download from:', url);
  
  // Create a hidden link and click it
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank'; // Open in new tab if needed
  link.download = `${filename}-${new Date().getTime()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('✅ Download initiated');
}

/**
 * Download file from S3 URL via HTTP (requires CORS to be configured)
 */
private downloadFromS3(s3Url: string, filename: string) {
  this.reportsService.downloadFileFromUrl(s3Url).subscribe({
    next: (content) => {
      console.log('✅ Downloaded from S3, size:', content.length);
      this.downloadAsFile(content, filename, 'text/plain');
    },
    error: (error) => {
      console.error('❌ S3 Download error:', error);
      alert(
        `❌ Failed to download from S3\n\n` +
        `This is likely a CORS issue.\n\n` +
        `The file is being downloaded directly via browser instead.`
      );
      
      // Fallback: try direct download
      this.downloadDirect(s3Url, filename);
    }
  });
}


  /**
   * Download string content as file
   */
  private downloadAsFile(content: string, filename: string, mimeType: string) {
    const dataBlob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Format report data as readable text (fallback if no S3 URL)
   */
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
    text += `                    DATA\n`;
    text += `${separator}\n\n`;
    
    if (report.data && Object.keys(report.data).length > 0) {
      text += this.formatDataAsText(report.data, 0);
    } else {
      text += 'No data available\n';
    }
    
    text += `\n${separator}\n`;
    text += `                 END OF REPORT\n`;
    text += `${separator}\n`;
    
    return text;
  }

  /**
   * Recursively format data object as indented text
   */
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
