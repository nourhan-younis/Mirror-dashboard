import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";
import { environment } from "../../../environments/environment";

// core/services/teams.service.ts
export interface TeamMember {
  _id?: string;
  name: string;
  description: string;
  email: string;
  whatsapp: string;
  linkedIn: string;
  img: string;
  files?: File[];
}

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private apiUrl = `${environment.baseUrl}team-members`;
  private readonly uploadUrl = `${environment.baseUrl}team-members/upload`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(this.apiUrl);
  }

  create(team: TeamMember): Observable<TeamMember> {
    return this.http.post<TeamMember>(this.apiUrl, team);
  }

  update(id: string, team: TeamMember): Observable<TeamMember> {
    return this.http.put<TeamMember>(`${this.apiUrl}/${id}`, team);
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
