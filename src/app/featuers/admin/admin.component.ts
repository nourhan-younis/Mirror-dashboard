import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AdminsService, Admin } from '../../core/services/admins.service';
import { AdminDialogComponent } from './admin-dialog/admin-dialog.component';

@Component({
  selector: 'app-admins',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    AdminDialogComponent,
  ],
})
export class AdminsComponent implements OnInit {
  displayedColumns = ['username', 'actions'];
  admins: Admin[] = [];

  constructor(
    private adminsService: AdminsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins() {
    this.adminsService.getAll().subscribe({
      next: (res) => (this.admins = res),
      error: () => this.snackBar.open('Failed to load admins', 'Close', { duration: 3000 }),
    });
  }

  addAdmin() {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: '400px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminsService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Admin created', 'Close', { duration: 2000 });
            this.loadAdmins();
          },
          error: () => this.snackBar.open('Failed to create', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  editAdmin(admin: Admin) {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: '400px',
      data: admin,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminsService.update(admin._id!, result).subscribe({
          next: () => {
            this.snackBar.open('Admin updated', 'Close', { duration: 2000 });
            this.loadAdmins();
          },
          error: () => this.snackBar.open('Failed to update', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  deleteAdmin(admin: Admin) {
    if (confirm(`Delete admin "${admin.username}"?`)) {
      this.adminsService.delete(admin._id!).subscribe({
        next: () => {
          this.snackBar.open('Admin deleted', 'Close', { duration: 2000 });
          this.loadAdmins();
        },
        error: () => this.snackBar.open('Failed to delete', 'Close', { duration: 3000 }),
      });
    }
  }
}
