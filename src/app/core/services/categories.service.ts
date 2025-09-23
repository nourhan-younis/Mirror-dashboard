import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Category {
  _id: string;
  name: string;
  categoryId?:string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly baseUrl = `${environment.baseUrl}categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

   create(project: Partial<Category>): Observable<Category> {
      return this.http.post<Category>(this.baseUrl, project);
    }
  
    /** Update project by ID */
    update(id: string, project: Partial<Category>): Observable<Category> {
      return this.http.put<Category>(`${this.baseUrl}/${id}`, project);
    }
  
    /** Delete project by ID */
    delete(id: string): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
