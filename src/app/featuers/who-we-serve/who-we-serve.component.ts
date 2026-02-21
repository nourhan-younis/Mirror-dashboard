import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WhoWeServeService, WhoWeServe } from '../../core/services/who-we-serve.service';

@Component({
  selector: 'app-manage-who-we-serve',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './who-we-serve.component.html',
})
export class ManageWhoWeServeComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: WhoWeServeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      header: ['', Validators.required],
      description: ['', Validators.required],
      items: this.fb.array([]),
    });

    this.loadData();
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private createItem(item?: { title: string; description: string }) {
    return this.fb.group({
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
    });
  }

  addItem(item?: { title: string; description: string }) {
    this.items.push(this.createItem(item));
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  loadData() {
    this.loading = true;
    this.service.get().subscribe({
      next: (res) => {
        if (res) {
          this.form.patchValue({
            header: res.header,
            description: res.description,
          });
          this.items.clear();
          res.items.forEach((item) => this.addItem(item));
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load data', 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  save() {
    if (this.form.invalid) return;
    const payload: WhoWeServe = this.form.value;
    this.service.update(payload).subscribe({
      next: () => this.snackBar.open('Saved successfully!', 'Close', { duration: 2000 }),
      error: () => this.snackBar.open('Save failed!', 'Close', { duration: 3000 }),
    });
  }
}