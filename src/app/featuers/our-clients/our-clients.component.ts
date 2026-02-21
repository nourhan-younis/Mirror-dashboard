import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ClientsService, Client } from '../../core/services/clients.service';
import { ClientDialogComponent } from './client-dialog/client-dialog.component';
import { environment } from '../../../environments/environment';


@Component({
   selector: 'app-our-clients',
  standalone: true,
  templateUrl: './our-clients.component.html',
  styleUrl: './our-clients.component.scss',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    ClientDialogComponent
  ],
})

export class OurClientsComponent  implements OnInit {
  displayedColumns = ['logo', 'name', 'actions'];
  clients: Client[] = [];
  imageBase = `${environment.baseUrl.replace('/api/', '')}`;

  constructor(
    private clientsService: ClientsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientsService.getAll().subscribe({
      next: (res) => (this.clients = res),
      error: () =>
        this.snackBar.open('Failed to load clients', 'Close', { duration: 3000 }),
    });
  }

  addClient() {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clientsService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Client created', 'Close', { duration: 2000 });
            this.loadClients();
          },
          error: () =>
            this.snackBar.open('Failed to create', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  deleteClient(client: Client) {
    if (confirm(`Delete client "${client.name}"?`)) {
      this.clientsService.delete(client._id!).subscribe({
        next: () => {
          this.snackBar.open('Client deleted', 'Close', { duration: 2000 });
          this.loadClients();
        },
        error: () =>
          this.snackBar.open('Failed to delete', 'Close', { duration: 3000 }),
      });
    }
  }
}