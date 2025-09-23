import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommentDialogComponent } from './comments-dialog/comments-dialog.component';
import { PeapoleComment, PeapoleCommentsService } from '../../core/services/comments.service';


@Component({
  selector: 'app-comment-comment-table',
  templateUrl: './comment.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    CommentDialogComponent,
  ],
})
export class CommentTableComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'comment',
    'position',
    'actions',
  ];
  dataSource = new MatTableDataSource<PeapoleComment>();

  constructor(
    private peapoleCommentsService: PeapoleCommentsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.peapoleCommentsService.getAll().subscribe({
      next: (data) => (this.dataSource.data = data),
      error: () =>
        this.snackBar.open('Failed to load team members', 'Close', {
          duration: 3000,
        }),
    });
  }

  addTeam(): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, { width: '600px' });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        let imagePaths: string[] = [];
        if (result.files?.length) {
          imagePaths = await this.peapoleCommentsService.uploadFiles(result.files);
        }
        const team: PeapoleComment = { ...result, images: imagePaths };
        this.peapoleCommentsService.create(team).subscribe({
          next: () => {
            this.snackBar.open('Team comment added', 'Close', {
              duration: 3000,
            });
            this.loadTeams();
          },
          error: () =>
            this.snackBar.open('Failed to add comment', 'Close', {
              duration: 3000,
            }),
        });
      }
    });
  }

  editTeam(comment: PeapoleComment): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '600px',
      data: comment,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
            let imagePaths: string[] = result.images || [];;
        if (result.files?.length) {
          imagePaths = await this.peapoleCommentsService.uploadFiles(result.files);
        }

        const updated: PeapoleComment = { ...result, images: imagePaths };
        this.peapoleCommentsService.update(comment._id!, updated).subscribe({
          next: () => {
            this.snackBar.open('Updated', 'Close', { duration: 3000 });
            this.loadTeams();
          },
          error: () =>
            this.snackBar.open('Failed to update', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  deleteTeam(comment: PeapoleComment): void {
    if (confirm(`Are you sure you want to delete "${comment.name}"?`)) {
      this.peapoleCommentsService.delete(comment._id!).subscribe({
        next: () => {
          this.snackBar.open('Deleted', 'Close', { duration: 3000 });
          this.loadTeams();
        },
        error: () =>
          this.snackBar.open('Failed to delete', 'Close', { duration: 3000 }),
      });
    }
  }
}
