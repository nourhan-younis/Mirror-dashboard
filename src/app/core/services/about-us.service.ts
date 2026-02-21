import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Stat {
  title: string;
  value: string;
}

export interface AboutUs {
  heading: string;
  subHeading: string;
  shortText: string;
  fullText: string;
  stats: Stat[];
  videoUrl: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class AboutUsService {
  private apiUrl = `${environment.baseUrl}about-us`;

  constructor(private http: HttpClient) {}

  get(): Observable<AboutUs> {
    return this.http.get<AboutUs>(this.apiUrl);
  }

  update(data: any): Observable<AboutUs> {
    return this.http.post<AboutUs>(this.apiUrl, data);
  }
}