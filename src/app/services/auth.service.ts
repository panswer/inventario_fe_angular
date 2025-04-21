import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AuthServiceSignInInput,
  AuthServiceSignInOutput,
} from '../interfaces/services/auth-service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthorizationPath } from '../enums/api/authorization';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly host = environment.apiUrl;
  private authorized = sessionStorage.getItem('Authorization');

  private http = inject(HttpClient);

  constructor() {}

  signIn(data: AuthServiceSignInInput): Observable<AuthServiceSignInOutput> {
    return this.http
      .post(`${this.host}${AuthorizationPath.SIGN_IN}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .pipe(
        switchMap((res: AuthServiceSignInOutput) => {
          if (res.authorization) {
            sessionStorage.setItem('Authorization', res.authorization);
            this.authorized = res.authorization;
          }

          return of(res);
        }),
        catchError(() => {
          return of<AuthServiceSignInOutput>({
            message: 'Email o clave invalido',
          });
        })
      );
  }

  getToken(): string | null {
    return this.authorized;
  }

  isValidToken(): boolean {
    return !!this.authorized;
  }
}
