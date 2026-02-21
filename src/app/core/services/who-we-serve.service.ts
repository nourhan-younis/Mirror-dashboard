import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface WhoWeServeItem {
  title: string;
  description: string;
}

export interface WhoWeServe {
  header: string;
  description: string;
  items: WhoWeServeItem[];
}

@Injectable({
  providedIn: 'root',
})
export class WhoWeServeService {
  private baseUrl = `${environment.baseUrl}who-we-serve`;

  constructor(private http: HttpClient) {}

  get(): Observable<WhoWeServe> {
    return this.http.get<WhoWeServe>(this.baseUrl);
  }

  update(data: WhoWeServe): Observable<WhoWeServe> {
    return this.http.post<WhoWeServe>(this.baseUrl, data);
  }
}