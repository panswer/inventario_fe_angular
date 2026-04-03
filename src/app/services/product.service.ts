import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import {
  GetAllProductsInput,
  GetAllProductsOutput,
  GetProductByBarcodeOutput,
  GetProductByIdOutput,
  UpdateProductByIdData,
  UpdateProductByIdInput,
  UpdateProductByIdOutput,
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

  createProduct(newProduct: CreateProduct, image?: File): Observable<CreateProductResult> {
    let body: FormData | CreateProduct;

    if (image) {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('amount', String(newProduct.amount));
      formData.append('coin', newProduct.coin);
      if (newProduct.barcode) {
        formData.append('barcode', newProduct.barcode);
      }
      if (newProduct.categories && newProduct.categories.length > 0) {
        newProduct.categories.forEach((cat) => formData.append('categories', cat));
      }
      formData.append('image', image);
      body = formData;
    } else {
      body = newProduct;
    }

    return this.requestService
      .postRequest({
        path: '/product',
        body,
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

  getProductById(productId: string): Observable<GetProductByIdOutput> {
    return this
      .requestService
      .getRequest({
        path: `/product/${productId}`,
      })
      .pipe(
        catchError(() => of({ message: "No se pudo obtener el producto" }))
      )
  }

  updateProductById(data: UpdateProductByIdInput, image?: File): Observable<UpdateProductByIdOutput> {
    let body: FormData | UpdateProductByIdData;

    if (image) {
      const formData = new FormData();
      if (data.data.name) formData.append('name', data.data.name);
      formData.append('inStock', String(data.data.inStock));
      if (data.data.barcode !== undefined) formData.append('barcode', data.data.barcode ?? '');
      if (data.data.categories && data.data.categories.length > 0) {
        data.data.categories.forEach((cat) => formData.append('categories', cat));
      }
      formData.append('image', image);
      body = formData;
    } else {
      body = data.data;
    }

    return this
      .requestService
      .putRequest({
        path: `/product/${data.productId}`,
        body
      })
      .pipe(
        catchError(() => of({ message: "No se pudo actualizar el producto" }))
      );
  }

  getProductByBarcode(barcode: string): Observable<GetProductByBarcodeOutput> {
    return this
      .requestService
      .getRequest({
        path: `${ProductPath.PRODUCT_BARCODE}/${barcode}`,
      })
      .pipe(
        catchError(() => of({ message: "No se pudo buscar el producto por código de barras" }))
      );
  }
}
