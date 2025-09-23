import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.baseUrl}admins`;
  private readonly tokenKey = 'token';
  private readonly usernameKey = 'username'; // ✅ New key

  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  public readonly isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient) {}

  /** Login and store token + username */
  login(username: string, password: string): Observable<{ token: string; username: string }> {
    return this.http.post<{ token: string; username: string }>(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap(res => {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.usernameKey, res.username); // ✅ Store username too!
          this._isLoggedIn$.next(true);
        })
      );
  }

  /** Remove token & username */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey); // ✅ Clear username too
    this._isLoggedIn$.next(false);
  }

  /** Get token for interceptor */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Get stored username */
  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  /** Is there a token? */
  hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  get isLoggedIn(): boolean {
    return this.hasToken();
  }
}
