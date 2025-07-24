import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import {
  GetAllProductsInput,
  GetAllProductsOutput,
} from '../interfaces/services/product-service';
import { ProductPath } from '../enums/api/product';
import { RequestService } from './request.service';
import {
  CreateProduct,
  CreateProductResult,
  CreateProductResultInterface,
} from '../interfaces/create-product';
import { Product } from '../models/product';
import { Price } from '../models/price';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private requestService = inject(RequestService);

  getAllProducts(
    params: GetAllProductsInput
  ): Observable<GetAllProductsOutput> {
    const query: Record<string, string> = {};

    if (params.limit) {
      query['limit'] = `${params.limit}`;
    }

    if (params.page) {
      query['page'] = `${params.page}`;
    }

    return this.requestService
      .getRequest({
        path: ProductPath.PRODUCT,
        query,
      })
      .pipe(
        catchError(() =>
          of<GetAllProductsOutput>({
            products: [],
            total: 0,
            message: 'No se pudo consultar la lista de productos',
          })
        )
      );
  }

  createProduct(newProduct: CreateProduct): Observable<CreateProductResult> {
    return this.requestService
      .postRequest({
        path: '/product',
        body: newProduct,
      })
      .pipe(
        switchMap((value: CreateProductResultInterface) => {
          return of<CreateProductResult>({
            product: new Product(value.product),
            price: new Price(value.price),
          });
        }),
        catchError(() => {
          return of({
            message: "No se pudo crear el producto"
          })
        })
      );
  }
}
