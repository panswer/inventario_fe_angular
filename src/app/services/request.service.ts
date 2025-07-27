import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import {
  RequestPostServiceInput,
  RequestPutServiceInput,
  RequestServiceInput,
} from '../interfaces/services/request-service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private readonly host = environment.apiUrl;
  private readonly dictionary = {
    authToken: 'Authorization',
  };
  private authorized: string =
    sessionStorage.getItem(this.dictionary.authToken) || '';

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() { }

  private getDefaultHeader(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (this.authorized) {
      headers[this.dictionary.authToken] = `Bearer ${this.authorized}`;
    }

    return headers;
  }

  private validateStatusResult(status: number | null) {
    if (status && [401, 403].includes(status)) {
      this.logout();
      this.router.navigate(['login']);
    }
  }

  getRequest(params: RequestServiceInput): Observable<any> {
    let queryStr = '';

    if (params.query) {
      const urlSearch = new URLSearchParams(params.query);
      queryStr = urlSearch.toString();
    }

    let uri = `${this.host}${params.path}`;

    if (queryStr) {
      uri = uri.concat('?', queryStr);
    }

    const headers = this.getDefaultHeader();

    return this.http.get(uri, { headers }).pipe(
      catchError((err) => {
        this.validateStatusResult(err.status);

        return throwError(err);
      })
    );
  }

  postRequest(params: RequestPostServiceInput): Observable<any> {
    const uri = `${this.host}${params.path}`;
    const headers = this.getDefaultHeader();

    return this.http.post(uri, params.body, { headers }).pipe(
      catchError((err) => {
        this.validateStatusResult(err.status);

        return throwError(err);
      })
    );
  }

  putRequest(params: RequestPutServiceInput): Observable<any> {
    const uri = `${this.host}${params.path}`;
    const headers = this.getDefaultHeader();

    return this
      .http
      .put(uri, params.body, { headers })
      .pipe(
        catchError((err) => {
          this.validateStatusResult(err.status);

          return throwError(err);
        })
      )
  }

  logout() {
    sessionStorage.removeItem(this.dictionary.authToken);
    this.authorized = '';
  }

  setToken(token: string) {
    this.authorized = token;
    sessionStorage.setItem(this.dictionary.authToken, this.authorized);
  }

  getToken(): string {
    return this.authorized;
  }
}
