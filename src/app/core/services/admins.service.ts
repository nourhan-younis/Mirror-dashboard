import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Admin {
  _id?: string;
  username: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminsService {
  private baseUrl = `${environment.baseUrl}admins`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.baseUrl);
  }

  create(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(this.baseUrl, admin);
  }

  update(id: string, admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.baseUrl}/${id}`, admin);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
