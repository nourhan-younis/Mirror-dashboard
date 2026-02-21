import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HowWeWorkService } from '../../core/services/how-we-work.service';


@Component({
  selector: 'app-how-we-work',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './how-we-work.component.html',
  styleUrls: ['./how-we-work.component.scss'],
})
export class HowWeWorkComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: HowWeWorkService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      heading: ['', Validators.required],
      description: [''],
      steps: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  // ---------------------------
  // Load existing data
  // ---------------------------
  loadData() {
    this.service.get().subscribe({
      next: (res) => {
        if (res) {
          this.form.patchValue({
            heading: res.heading,
            description: res.description
          });

          this.setSteps(res.steps);
        }
      },
      error: () => {
        this.snackBar.open('Failed to load data', 'Close', { duration: 3000 });
      }
    });
  }

  // ---------------------------
  // FormArray getter
  // ---------------------------
  get steps(): FormArray {
    return this.form.get('steps') as FormArray;
  }

  // ---------------------------
  // Set existing steps
  // ---------------------------
  setSteps(steps: any[]) {
    this.steps.clear();

    if (steps && steps.length) {
      steps.forEach(step => {
        this.steps.push(
          this.fb.group({
            number: [step.number],
            title: [step.title],
            description: [step.description]
          })
        );
      });
    }
  }

  // ---------------------------
  // Add new step
  // ---------------------------
  addStep() {
    const stepNumber = (this.steps.length + 1).toString().padStart(2, '0');

    this.steps.push(
      this.fb.group({
        number: [stepNumber],
        title: ['', Validators.required],
        description: ['']
      })
    );
  }

  // ---------------------------
  // Remove step
  // ---------------------------
  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  // ---------------------------
  // Save
  // ---------------------------
  save() {
    if (this.form.invalid) return;

    this.service.update(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Saved successfully!', 'Close', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Save failed!', 'Close', { duration: 3000 });
      }
    });
  }
}