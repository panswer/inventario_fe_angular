import { inject, Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { GetProfileOutput, GetUsersOutput, UpdateUserRoleInput, UpdateUserRoleOutput } from '../interfaces/services/user-service';
import { AuthorizationPath } from '../enums/api/authorization';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private requestService = inject(RequestService);

  getProfile(): Observable<GetProfileOutput> {
    return this
      .requestService
      .getRequest({
        path: AuthorizationPath.USER_PROFILE,
      })
      .pipe(
        catchError(() => of({
          user: {
            _id: '',
            username: '',
            role: '',
            createdAt: 0,
            updatedAt: 0,
          } as User,
        }))
      );
  }

  getUsers(): Observable<GetUsersOutput> {
    return this
      .requestService
      .getRequest({
        path: '/users',
      })
      .pipe(
        catchError(() => of({
          users: [],
        }))
      )
  }

  updateUserRole(userId: string, params: UpdateUserRoleInput): Observable<UpdateUserRoleOutput> {
    return this
      .requestService
      .patchRequest({
        path: `/users/${userId}/role`,
        body: params,
      })
      .pipe(
        catchError(() => of({
          _id: '',
          username: '',
          role: '',
          createdAt: 0,
          updatedAt: 0,
        }))
      )
  }
}
