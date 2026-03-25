import { inject, Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { GetUsersOutput, UpdateUserRoleInput, UpdateUserRoleOutput } from '../interfaces/services/user-service';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private requestService = inject(RequestService);

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
