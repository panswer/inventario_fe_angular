import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { GetAllWarehousesInput, GetAllWarehousesOutput } from '../interfaces/services/warehouse-service';
import { WarehousePath } from '../enums/api/warehouse';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private requestService = inject(RequestService);

  getAllWarehouses(params: GetAllWarehousesInput = {}): Observable<GetAllWarehousesOutput> {
    const query: Record<string, string> = {};

    if (params.limit) {
      query['limit'] = `${params.limit}`;
    }

    if (params.page) {
      query['page'] = `${params.page}`;
    }

    return this.requestService
      .getRequest({
        path: WarehousePath.WAREHOUSE,
        query,
      })
      .pipe(
        catchError(() =>
          of<GetAllWarehousesOutput>({
            warehouses: [],
            total: 0,
            message: 'No se pudo consultar la lista de almacenes',
          })
        )
      );
  }
}
