import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  TeamMember,
  TeamsService,
} from '../../core/services/team-member.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { TeamDialogComponent } from './team-dialog/team-dialog.component';

@Component({
  selector: 'app-team-member-table',
  templateUrl: './team.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    TeamDialogComponent,
  ],
})
export class TeamMemberTableComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'whatsapp',
    'linkedIn',
    'description',
    'actions',
  ];
  dataSource = new MatTableDataSource<TeamMember>();

  constructor(
    private teamsService: TeamsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.teamsService.getAll().subscribe({
      next: (data) => (this.dataSource.data = data),
      error: () =>
        this.snackBar.open('Failed to load team members', 'Close', {
          duration: 3000,
        }),
    });
  }

  addTeam(): void {
    const dialogRef = this.dialog.open(TeamDialogComponent, { width: '600px' });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        let imagePaths: string[] = [];
        if (result.files?.length) {
          imagePaths = await this.teamsService.uploadFiles(result.files);
        }
        const team: TeamMember = { ...result, images: imagePaths };
        this.teamsService.create(team).subscribe({
          next: () => {
            this.snackBar.open('Team member added', 'Close', {
              duration: 3000,
            });
            this.loadTeams();
          },
          error: () =>
            this.snackBar.open('Failed to add member', 'Close', {
              duration: 3000,
            }),
        });
      }
    });
  }

  editTeam(member: TeamMember): void {
    const dialogRef = this.dialog.open(TeamDialogComponent, {
      width: '600px',
      data: member,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
            let imagePaths: string[] = result.images || [];;
        if (result.files?.length) {
          imagePaths = await this.teamsService.uploadFiles(result.files);
        }

        const updated: TeamMember = { ...result, images: imagePaths };
        this.teamsService.update(member._id!, updated).subscribe({
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

  deleteTeam(member: TeamMember): void {
    if (confirm(`Are you sure you want to delete "${member.name}"?`)) {
      this.teamsService.delete(member._id!).subscribe({
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
