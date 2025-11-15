import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-priority-lifecycle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './priority-lifecycle-dialog.component.html',
  styleUrls: ['./priority-lifecycle-dialog.component.scss']
})
export class PriorityLifecycleDialogComponent {
  priorityForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PriorityLifecycleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.priorityForm = this.fb.group({
      // priority: [-1, [Validators.required, Validators.min(-1), Validators.max(10)]],
      priority: [-1, [Validators.required]],

      lifecycle: [60, [Validators.required, Validators.min(1)]]
    });
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
