import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private api = `${environment.baseUrl}portfolio`;

  constructor(private http: HttpClient) {}

  upload(formData: FormData) {
    return this.http.post(this.api, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getAll() {
    return this.http.get<any[]>(this.api);
  }
}
