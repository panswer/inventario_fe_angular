import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { 
  GetAllStocksInput, 
  GetAllStocksOutput, 
  GetStockByIdInput, 
  GetStockByIdOutput, 
  GetStockByProductIdInput, 
  GetStockByProductIdOutput,
  UpdateStockMinQuantityInput,
  UpdateStockMinQuantityOutput,
  AddStockAmountInput,
  AddStockAmountOutput,
  RemoveStockAmountInput,
  RemoveStockAmountOutput
} from '../interfaces/services/stock-service';
import { StockPath } from '../enums/api/stock';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private requestService = inject(RequestService);

  getAllStocks(params: GetAllStocksInput): Observable<GetAllStocksOutput> {
    const query: Record<string, string> = {};

    if (params.limit) {
      query['limit'] = `${params.limit}`;
    }

    if (params.page) {
      query['page'] = `${params.page}`;
    }

    if (params.warehouseId) {
      query['warehouseId'] = params.warehouseId;
    }

    return this.requestService
      .getRequest({
        path: StockPath.STOCK,
        query,
      })
      .pipe(
        catchError(() =>
          of<GetAllStocksOutput>({
            stocks: [],
            total: 0,
            message: 'No se pudo consultar la lista de stocks',
          })
        )
      );
  }

  getStockByProductId(params: GetStockByProductIdInput): Observable<GetStockByProductIdOutput> {
    return this.requestService
      .getRequest({
        path: `${StockPath.STOCK}/product/${params.productId}`,
      })
      .pipe(
        catchError(() =>
          of<GetStockByProductIdOutput>({
            stock: undefined,
            message: 'No se pudo obtener el stock del producto',
          })
        )
      );
  }

  getStockById(params: GetStockByIdInput): Observable<GetStockByIdOutput> {
    return this.requestService
      .getRequest({
        path: `${StockPath.STOCK}/${params.stockId}`,
      })
      .pipe(
        catchError(() =>
          of<GetStockByIdOutput>({
            stock: undefined,
            message: 'No se pudo obtener el stock',
          })
        )
      );
  }

  updateStockMinQuantity(params: UpdateStockMinQuantityInput): Observable<UpdateStockMinQuantityOutput> {
    return this.requestService
      .putRequest({
        path: `${StockPath.STOCK}/${params.stockId}`,
        body: { minQuantity: params.minQuantity },
      })
      .pipe(
        catchError(() =>
          of<UpdateStockMinQuantityOutput>({
            stock: undefined,
            message: 'No se pudo actualizar la cantidad mínima',
          })
        )
      );
  }

  addStockAmount(params: AddStockAmountInput): Observable<AddStockAmountOutput> {
    return this.requestService
      .patchRequest({
        path: `${StockPath.STOCK}/${params.stockId}/add`,
        body: { amount: params.amount },
      })
      .pipe(
        catchError(() =>
          of<AddStockAmountOutput>({
            stock: undefined,
            message: 'No se pudo agregar stock',
          })
        )
      );
  }

  removeStockAmount(params: RemoveStockAmountInput): Observable<RemoveStockAmountOutput> {
    return this.requestService
      .patchRequest({
        path: `${StockPath.STOCK}/${params.stockId}/remove`,
        body: { amount: params.amount },
      })
      .pipe(
        catchError(() =>
          of<RemoveStockAmountOutput>({
            message: 'No se pudo quitar stock',
          })
        )
      );
  }
}
