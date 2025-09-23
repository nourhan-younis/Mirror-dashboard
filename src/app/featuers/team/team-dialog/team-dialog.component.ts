import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';


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
  selector: 'app-team-dialog',
  standalone: true,
  templateUrl: './team-dialog.component.html',
  styleUrls: ['./team-dialog.component.scss'],
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
export class TeamDialogComponent {
  form: FormGroup;
  files: File[] = [];
  existingImages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
   

    const p = data;
    console.log(data);

    if (p) {
      this.existingImages = p.images || [];
      
    }
    

    this.form = this.fb.group({
      name: [p?.name || '', Validators.required],
      linkedIn: [p?.linkedIn || ''],
      whatsapp: [p?.whatsapp || ''],
      description: [p?.description || '', Validators.required],
      email: [p?.email || '', Validators.required],
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
