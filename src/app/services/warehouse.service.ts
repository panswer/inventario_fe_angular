import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import {
  CreateWarehouseInput,
  CreateWarehouseOutput,
  GetAllWarehousesInput,
  GetAllWarehousesOutput,
  GetWarehouseByIdOutput,
  UpdateWarehouseInput,
  UpdateWarehouseOutput,
  WarehouseInterface,
} from '../interfaces/services/warehouse-service';
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

  getWarehouseById(warehouseId: string): Observable<GetWarehouseByIdOutput> {
    return this.requestService
      .getRequest({
        path: `${WarehousePath.WAREHOUSE}/${warehouseId}`,
      })
      .pipe(
        catchError(() =>
          of<GetWarehouseByIdOutput>({
            warehouse: {} as WarehouseInterface,
            message: 'No se pudo obtener el almacén',
          })
        )
      );
  }

  createWarehouse(data: CreateWarehouseInput): Observable<CreateWarehouseOutput> {
    return this.requestService
      .postRequest({
        path: WarehousePath.WAREHOUSE,
        body: data,
      })
      .pipe(
        catchError(() =>
          of<CreateWarehouseOutput>({
            warehouse: {} as WarehouseInterface,
            message: 'No se pudo crear el almacén',
          })
        )
      );
  }

  updateWarehouse(warehouseId: string, data: UpdateWarehouseInput): Observable<UpdateWarehouseOutput> {
    return this.requestService
      .putRequest({
        path: `${WarehousePath.WAREHOUSE}/${warehouseId}`,
        body: data,
      })
      .pipe(
        catchError(() =>
          of<UpdateWarehouseOutput>({
            warehouse: {} as WarehouseInterface,
            message: 'No se pudo actualizar el almacén',
          })
        )
      );
  }

  deleteWarehouse(warehouseId: string): Observable<{ warehouse: unknown; message?: string }> {
    return this.requestService
      .deleteRequest({
        path: `${WarehousePath.WAREHOUSE}/${warehouseId}`,
      })
      .pipe(
        catchError(() =>
          of({
            warehouse: null,
            message: 'No se pudo eliminar el almacén',
          })
        )
      );
  }
}
