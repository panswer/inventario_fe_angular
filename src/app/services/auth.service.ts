import { inject, Injectable } from '@angular/core';
import {
  AuthServiceSignInInput,
  AuthServiceSignInOutput,
  AuthServiceResetPasswordInput,
  AuthServiceResetPasswordOutput,
  AuthServiceResetPasswordVerifyInput,
  AuthServiceResetPasswordVerifyOutput,
  AuthServiceSignUpInput,
  AuthServiceSignUpOutput,
} from '../interfaces/services/auth-service';
import { BehaviorSubject, catchError, finalize, firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { AuthorizationPath } from '../enums/api/authorization';
import { RequestService } from './request.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private requestService = inject(RequestService);
  private router = inject(Router);
  private userService = inject(UserService);

  private currentUser$ = new BehaviorSubject<User | null>(null);

  get currentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  getUserRole(): string | null {
    return this.currentUser$.value?.role ?? null;
  }

  hasRole(allowedRoles: string[]): boolean {
    const role = this.getUserRole();
    return role ? allowedRoles.includes(role) : false;
  }

  isCashier(): boolean {
    return this.getUserRole() === 'cashier';
  }

  isAdminOrManager(): boolean {
    const role = this.getUserRole();
    return role === 'admin' || role === 'manager';
  }

  async loadProfile(): Promise<void> {
    const profile = await firstValueFrom(this.userService.getProfile());
    this.currentUser$.next(profile.user);
  }

  signIn(data: AuthServiceSignInInput): Observable<AuthServiceSignInOutput> {
    return this.requestService
      .postRequest({
        path: AuthorizationPath.SIGN_IN,
        body: data,
      })
      .pipe(
        switchMap((res: AuthServiceSignInOutput) => {
          if (res.authorization) {
            this.requestService.setToken(res.authorization);
            this.loadProfile().then(() => {
              this.router.navigate(['']);
            });
          }

          return of(res);
        }),
        catchError(() => of({ message: 'Email o clave invalido' }))
      );
  }

  signUp(data: AuthServiceSignUpInput): Observable<AuthServiceSignUpOutput> {
    return this.requestService
      .postRequest({
        path: AuthorizationPath.SIGN_UP,
        body: data,
      })
      .pipe(
        catchError((err) => {
          if (err.status === 409) {
            return of({ message: 'El usuario ya está registrado' });
          }
          if (err.status === 500) {
            return of({ message: 'Error del servidor' });
          }
          return of({ message: 'No se pudo registrar el usuario' });
        })
      );
  }

  getToken(): string {
    return this.requestService.getToken();
  }

  isValidToken(): boolean {
    return !!this.getToken();
  }

  resetPassword(data: AuthServiceResetPasswordInput): Observable<AuthServiceResetPasswordOutput> {
    return this.requestService
      .postRequest({
        path: AuthorizationPath.RESET_PASSWORD,
        body: data,
      })
      .pipe(
        catchError(() => of({ message: 'No se pudo enviar el correo de recuperación' }))
      );
  }

  resetPasswordVerify(data: AuthServiceResetPasswordVerifyInput): Observable<AuthServiceResetPasswordVerifyOutput> {
    return this.requestService
      .postRequest({
        path: AuthorizationPath.RESET_PASSWORD_VERIFY,
        body: data,
      })
      .pipe(
        catchError((err) => {
          if (err.status === 404) {
            return of({ code: 1003, message: 'Token o correo inválido' });
          }
          if (err.status === 500) {
            return of({ code: 1004, message: 'Error del servidor' });
          }
          return of({ message: 'No se pudo verificar el token' });
        })
      );
  }

  logout(): void {
    this.requestService
      .postRequest({
        path: AuthorizationPath.SIGN_OUT,
        body: {},
      })
      .pipe(
        finalize(() => {
          this.currentUser$.next(null);
          this.requestService.logout();
          this.router.navigate(['/login']);
        })
      )
      .subscribe();
  }
}
