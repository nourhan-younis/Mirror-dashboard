import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private baseUrl = `${environment.baseUrl}messages`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Message[]> {
    return this.http.get<Message[]>(this.baseUrl);
  }
}
