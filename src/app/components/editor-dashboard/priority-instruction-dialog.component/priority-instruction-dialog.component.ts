import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-priority-instruction-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2>Priority Rules Guide</h2>
    <table>
      <thead>
        <tr><th>Priority Value</th><th>Description</th><th>Explanation</th></tr>
      </thead>
      <tbody>
        <tr><td>-1</td><td>Highest Priority</td><td>Breaking or urgent news, must be shown first and very prominently.</td></tr>
        <tr><td>1</td><td>High Priority</td><td>Significant news deserving lots of attention.</td></tr>
        <tr><td>2</td><td>Medium Priority</td><td>Moderately important news, shown after high priority articles.</td></tr>
        <tr><td>3</td><td>Low Priority</td><td>Less critical news stories, shown after medium priority.</td></tr>
        <tr><td>4</td><td>Very Low Priority</td><td>Minor news, shown towards the end of listings.</td></tr>
        <tr><td>5</td><td>Lowest Priority</td><td>Least important, only shown if space allows.</td></tr>
      </tbody>
    </table>
    <div class="dialog-actions">
      <button mat-button (click)="close()">Close</button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      color: #202124;
      padding: 24px;
      box-sizing: border-box;
      max-width: 650px;
      width: 100%;
    }
    h2 {
      margin-top: 0;
      margin-bottom: 16px;
      font-weight: 600;
      font-size: 1.5rem;
      color: #3f51b5;
      border-bottom: 2px solid #3f51b5;
      padding-bottom: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    thead {
      background-color: #e8eaf6;
      font-weight: 600;
      color: #3f51b5;
    }
    th, td {
      border: 1px solid #b0bec5;
      padding: 10px 15px;
      text-align: left;
      vertical-align: middle;
    }
    tbody tr:nth-child(even) {
      background-color: #f5f7fa;
    }
    .dialog-actions {
      text-align: right;
      margin-top: 16px;
    }
    button {
      background-color: #3f51b5;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    button:hover,
    button:focus {
      background-color: #303f9f;
      outline: none;
    }
    button:active {
      background-color: #283593;
    }
  `]
})
export class PriorityInstructionDialogComponent {
  constructor(public dialogRef: MatDialogRef<PriorityInstructionDialogComponent>) {}
  close() {
    this.dialogRef.close();
  }
}
