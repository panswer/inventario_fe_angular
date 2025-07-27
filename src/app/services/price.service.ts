import { inject, Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { GetPriceByProductIdOutput, UpdatePriceByIdInput, UpdatePriceByIdOutput } from '../interfaces/services/price-service';

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

  getPriceByProductId(productId: string): Observable<GetPriceByProductIdOutput> {
    return this
      .requestService
      .getRequest({
        path: `/price/product/${productId}`
      })
      .pipe(
        catchError(() => of({
          message: "No se pudo obtener el precio"
        }))
      );
  }

  updatePriceById(data: UpdatePriceByIdInput): Observable<UpdatePriceByIdOutput> {
    return this
      .requestService
      .putRequest({
        path: `/price/${data.priceId}`,
        body: data.data
      })
      .pipe(
        catchError(() => of({ message: "No se pudo actualizar el precio" }))
      );
  }
}
