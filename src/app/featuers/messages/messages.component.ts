import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MessagesService, Message } from '../../core/services/messages.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  imports: [
    CommonModule,
    MatTableModule,
    MatSnackBarModule
  ],
})
export class MessagesComponent implements OnInit {
  displayedColumns = ['name', 'email', 'subject', 'message', 'createdAt'];
  messages: Message[] = [];

  constructor(
    private messagesService: MessagesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messagesService.getAll().subscribe({
      next: (res) => this.messages = res,
      error: () => this.snackBar.open('Failed to load messages', 'Close', { duration: 3000 }),
    });
  }
}
