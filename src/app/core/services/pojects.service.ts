import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Project {
  _id?: string;
  images: string[];
  name: string;
  location: string;
  customerName: string;
  projectCost: number;
  projectTime: string;
  scopeOfWork: string;
  description: string;
  category?: {
    _id: string;
    name?: string;
  };
}

export interface ProjectResponse {
  projects: Project[];
  total: number;
  page: number;
  pages: number;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly baseUrl = `${environment.baseUrl}projects`;
   private readonly uploadUrl = `${environment.baseUrl}projects/upload`;

  constructor(private http: HttpClient) {}

  /**
   * Get paginated + optionally filtered by category
   * @param page Page number (starts at 1)
   * @param limit Page size
   * @param category Optional category ID
   */
  getAll(page = 1, limit = 10, category?: string): Observable<ProjectResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<ProjectResponse>(this.baseUrl, { params });
  }

  /** Create new project */
  create(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, project);
  }

  /** Update project by ID */
  update(id: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/${id}`, project);
  }

  /** Delete project by ID */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  async uploadFiles(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const res = await firstValueFrom(
      this.http.post<{ images: string[] }>(this.uploadUrl, formData)
    );
    return res.images;
  }
}
