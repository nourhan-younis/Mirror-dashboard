import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Client {
  _id?: string;
  name: string;
  logo: string;
}

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private api = `${environment.baseUrl}ourClients`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.api);
  }

  create(formData: FormData): Observable<Client> {
    return this.http.post<Client>(this.api, formData);
  }

  delete(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }
}