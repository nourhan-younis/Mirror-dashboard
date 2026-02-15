import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';


import { environment } from '../../../environments/environment';
import { PortfolioService } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-portfolio-upload',
  imports: [MatButtonModule, MatCardModule, MatProgressBarModule, NgIf],
  templateUrl: './portifilio.component.html',
  styleUrl: './portifilio.component.scss',
})
export class PortifilioComponent implements OnInit {

  selectedFile: File | null = null;
  fileName = '';
  uploadProgress = 0;
  isUploading = false;
  uploadedFileUrl: SafeResourceUrl | null = null;

  constructor(
    private portfolioService: PortfolioService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}

  portfolioTitle = '';
portfolioLink = '';



  ngOnInit() {
    this.loadPortfolio();
  }

  decodeTitle(text: string): string {
  return decodeURIComponent(escape(text));
}

  // 🔵 load existing PDF
  loadPortfolio() {
  this.portfolioService.getAll().subscribe((data: any) => {

    if (!data) return;

    const file = data.pdf;

    this.portfolioTitle = this.decodeTitle(data.title);

    this.portfolioLink =
      `${environment.baseUrl.replace('/api/', '')}/uploads/pdf/${file}`;
  });
}

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.fileName = file.name;
    } else {
      this.snackBar.open('Only PDF allowed', 'Close', { duration: 2000 });
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('pdf', this.selectedFile);

    this.isUploading = true;

    this.portfolioService.upload(formData).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress =
            Math.round((event.loaded / event.total) * 100);
        }

        if (event.type === HttpEventType.Response) {
          this.snackBar.open('Uploaded Successfully', 'Close', { duration: 2000 });

          this.isUploading = false;
          this.uploadProgress = 0;
          this.fileName = '';
          this.selectedFile = null;

          // 🔁 reload PDF after upload
          this.loadPortfolio();
        }
      },
      () => {
        this.snackBar.open('Upload failed', 'Close', { duration: 2000 });
        this.isUploading = false;
      }
    );
  }
}
