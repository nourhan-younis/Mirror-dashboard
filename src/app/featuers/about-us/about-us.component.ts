import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AboutUsService } from '../../core/services/about-us.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about-us',
  imports:[CommonModule,ReactiveFormsModule,MatFormFieldModule,MatIconModule,MatInputModule,MatButtonModule ],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  aboutForm: FormGroup;
  previewImg: string | ArrayBuffer | null = null;
  selectedImageFile: File | null = null;
  environment = environment;

  constructor(
    private fb: FormBuilder,
    private aboutUsService: AboutUsService,
    private snackBar: MatSnackBar
  ) {
    this.aboutForm = this.fb.group({
      heading: ['', Validators.required],
      subHeading: [''],
      fullText: [''],
      stats: this.fb.array([]),
      imageUrl: [''],
    });
  }

  ngOnInit(): void {
    // Load existing content from backend
    this.aboutUsService.get().subscribe({
      next: (res) => {
        if (res) {
          this.aboutForm.patchValue({
            heading: res.heading,
            subHeading: res.subHeading,
            fullText: res.fullText,
            imageUrl: res.imageUrl,
          });
          this.setStats(res.stats);
          if (res.imageUrl) this.previewImg = res.imageUrl;
        }
      },
      error: () => this.snackBar.open('Failed to load About Us', 'Close', { duration: 3000 }),
    });
  }

  // FormArray for stats
  get stats(): FormArray {
    return this.aboutForm.get('stats') as FormArray;
  }

  setStats(stats: any[]) {
    this.stats.clear();
    if (stats && stats.length) {
      stats.forEach((s) => this.stats.push(this.fb.group({ title: s.title, value: s.value })));
    }
  }

  addStat() {
    this.stats.push(this.fb.group({ title: '', value: '' }));
  }

  removeStat(index: number) {
    this.stats.removeAt(index);
  }

  // Handle image selection
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.previewImg = reader.result);
      reader.readAsDataURL(file);
    }
  }

  getImageSrc(): string {
  if (!this.previewImg) return '';

  // If base64 preview (starts with data:)
  if (typeof this.previewImg === 'string' && this.previewImg.startsWith('data:')) {
    return this.previewImg;
  }

  // Otherwise it's backend path
  return `${this.environment.baseUrl.replace('/api/', '')}${this.previewImg}`;
}

  // Save content
  save() {
    const formData = new FormData();

    // Append form values
    Object.keys(this.aboutForm.value).forEach((key) => {
      if (key !== 'stats') formData.append(key, this.aboutForm.value[key]);
    });

    // Append stats as JSON string
    formData.append('stats', JSON.stringify(this.aboutForm.value.stats));

    // Append image file if selected
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    // Call backend
    this.aboutUsService.update(formData).subscribe({
      next: () => this.snackBar.open('Saved successfully!', 'Close', { duration: 2000 }),
      error: () => this.snackBar.open('Save failed!', 'Close', { duration: 3000 }),
    });
  }
}