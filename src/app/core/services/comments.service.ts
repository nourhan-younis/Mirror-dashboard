import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";
import { environment } from "../../../environments/environment";

// core/services/teams.service.ts
export interface PeapoleComment {
  _id?: string;
  name: string;
  message: string;
  position: string;
  img: string;
  files?: File[];
}

@Injectable({ providedIn: 'root' })
export class PeapoleCommentsService {
  private apiUrl = `${environment.baseUrl}peapole-comments`;
  private readonly uploadUrl = `${environment.baseUrl}peapole-comments/upload`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PeapoleComment[]> {
    return this.http.get<PeapoleComment[]>(this.apiUrl);
  }

  create(team: PeapoleComment): Observable<PeapoleComment> {
    return this.http.post<PeapoleComment>(this.apiUrl, team);
  }

  update(id: string, team: PeapoleComment): Observable<PeapoleComment> {
    return this.http.put<PeapoleComment>(`${this.apiUrl}/${id}`, team);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
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
