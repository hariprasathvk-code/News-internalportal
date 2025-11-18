import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PriorityInstructionDialogComponent } from '../priority-instruction-dialog.component/priority-instruction-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-priority-lifecycle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule 
  ],
  templateUrl: './priority-lifecycle-dialog.component.html',
  styleUrls: ['./priority-lifecycle-dialog.component.scss']
})
export class PriorityLifecycleDialogComponent {
  priorityForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PriorityLifecycleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.priorityForm = this.fb.group({
      priority: [-1, [
        Validators.required,
        Validators.min(-1),
        Validators.max(5)
      ]],
      lifecycle: [60, [Validators.required, Validators.min(1)]]
    });
  }

  openInstructions(): void {
    this.dialog.open(PriorityInstructionDialogComponent, {
      width: '600px',
      maxHeight: '80vh'
    });
  }

  onPriorityInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (/[^0-9\-]/.test(value)) {
      value = value.replace(/[^0-9\-]/g, '');
    }

    let numericValue = Number(value);
    if (numericValue < -1) numericValue = -1;
    if (numericValue > 5) numericValue = 5;

    input.value = numericValue.toString();
    this.priorityForm.patchValue({ priority: numericValue }, { emitEvent: false });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSave(): void {
    if (this.priorityForm.valid) {
      this.dialogRef.close(this.priorityForm.value);
    }
  }

  setLifecycle(minutes: number): void {
    this.priorityForm.patchValue({ lifecycle: minutes });
  }
}
