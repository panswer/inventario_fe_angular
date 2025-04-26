import { inject, Injectable } from '@angular/core';
import {
  AuthServiceSignInInput,
  AuthServiceSignInOutput,
} from '../interfaces/services/auth-service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { AuthorizationPath } from '../enums/api/authorization';
import { RequestService } from './request.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private requestService = inject(RequestService);
  private router = inject(Router);

  signIn(data: AuthServiceSignInInput): Observable<AuthServiceSignInOutput> {
    return this.requestService
      .postRequest({
        path: AuthorizationPath.SIGN_IN,
        body: data,
      })
      .pipe(
        catchError(() =>
          of({
            message: 'Email o clave invalido',
          })
        ),
        switchMap((res) => {
          if (res.authorization) {
            this.requestService.setToken(res.authorization);
            this.router.navigate(['']);
          }

          return of({
            authorization: res.authorization,
          });
        })
      );
  }

  getToken(): string {
    return this.requestService.getToken();
  }

  isValidToken(): boolean {
    return !!this.getToken();
  }
}
