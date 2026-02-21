import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  templateUrl: './client-dialog.component.html',
  styleUrls: ['./client-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
})
export class ClientDialogComponent {
  name = '';
  selectedFile!: File;
  preview: string | ArrayBuffer | null = null;

  constructor(private dialogRef: MatDialogRef<ClientDialogComponent>) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  save() {
    if (!this.name || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('logo', this.selectedFile);

    this.dialogRef.close(formData);
  }

  close() {
    this.dialogRef.close();
  }
}