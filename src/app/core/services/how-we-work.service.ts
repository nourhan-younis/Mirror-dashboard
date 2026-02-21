import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HowWeWorkService {

  private api = `${environment.baseUrl}how-we-work`;

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<any>(this.api);
  }

  update(data: any) {
    return this.http.post(this.api, data);
  }
}