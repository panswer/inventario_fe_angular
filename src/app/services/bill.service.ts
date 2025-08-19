import { inject, Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { GetBillsInput, GetBillsOutput } from '../interfaces/services/bill-service';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private requestService = inject(RequestService);

  getBills(params: GetBillsInput): Observable<GetBillsOutput> {
    const query: Record<string, string> = {};

    if (params.limit) {
      query['limit'] = String(params.limit);
    }

    if (params.page) {
      query['page'] = String(params.page);
    }

    return this
      .requestService
      .getRequest({
        path: '/bill',
        query,
      })
      .pipe(
        catchError(() => of({
          bills: [],
          total: 0,
          message: "Unknown error",
        }))
      )
  }
}
