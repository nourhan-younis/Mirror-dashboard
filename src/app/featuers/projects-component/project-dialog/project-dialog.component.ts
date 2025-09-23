import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Project } from '../../../core/services/pojects.service';
import { Category } from '../../../core/services/categories.service';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatIconModule,
    CdkTextareaAutosize,
  ],
})
export class ProjectDialogComponent {
  form: FormGroup;
  categories: Category[] = [];
  files: File[] = [];
  existingImages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.categories = data.categories;

    const p = data.project;
    console.log(data);

    if (p) {
      this.existingImages = p.images || [];
      
    }
    

    this.form = this.fb.group({
      name: [p?.name || '', Validators.required],
      location: [p?.location || '', Validators.required],
      customerName: [p?.customerName || '', Validators.required],
      description: [p?.description || '', Validators.required],
      projectCost: [p?.projectCost || 0, Validators.required],
      projectTime: [
        p?.projectTime ? new Date(p.projectTime) : '',
        Validators.required,
      ],
      scopeOfWork: [p?.scopeOfWork || '', Validators.required],
      category: [p?.category?._id || '', Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files = Array.from(input.files);
    }
  }

  removeExistingImage(index: number) {
    this.existingImages.splice(index, 1);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    value.files = this.files;
    value.images = this.existingImages;

    this.dialogRef.close(value);
  }

  close() {
    this.dialogRef.close();
  }


  baseUrl = 'https://api.mirrorengineering.com'; // 👈 Update this!

getImageUrl(path: string): string {
  if (path && path.startsWith('http')) return path; // already absolute
  return path ? `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}` : '';
}
}
