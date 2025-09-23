import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = `${environment.baseUrl}videos`;

  constructor(private http: HttpClient) {}


  getProjectVideo() {
  return this.http.get<{ video: string }>(`${this.apiUrl}`);
}


  uploadVideo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('video', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  deleteVideo(filename: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${filename}`);
  }
}
