import { inject, Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { catchError, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  private requestService = inject(RequestService);

  getAllCoins(): Observable<string[]> {
    return this.requestService
      .getRequest({
        path: '/price/coin',
      })
      .pipe(
        switchMap((result) => of(result.coins)),
        catchError(() => {
          return of([]);
        })
      );
  }
}
