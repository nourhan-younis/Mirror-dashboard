import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Category, CategoriesService } from '../../core/services/categories.service';


import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    CategoryDialogComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<Category>();

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.dataSource.data = categories;
      },
      error: () => this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 })
    });
  }

  addCategory(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriesService.create({ name: result.name , categoryId: result.name  }).subscribe({
          next: () => {
            this.snackBar.open('Category added', 'Close', { duration: 2000 });
            this.loadCategories();
          },
          error: () => this.snackBar.open('Failed to add category', 'Close', { duration: 2000 })
        });
      }
    });
  }

  editCategory(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: category
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriesService.update(category._id!, { name: result.name }).subscribe({
          next: () => {
            this.snackBar.open('Category updated', 'Close', { duration: 2000 });
            this.loadCategories();
          },
          error: () => this.snackBar.open('Failed to update category', 'Close', { duration: 2000 })
        });
      }
    });
  }

  deleteCategory(category: Category): void {
    if (confirm(`Delete category "${category.name}"?`)) {
      this.categoriesService.delete(category._id!).subscribe({
        next: () => {
          this.snackBar.open('Category deleted', 'Close', { duration: 2000 });
          this.loadCategories();
        },
        error: () => this.snackBar.open('Failed to delete', 'Close', { duration: 2000 })
      });
    }
  }
}
