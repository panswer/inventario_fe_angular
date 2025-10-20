import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ProductService } from './product.service';
import { RequestService } from './request.service';
import {
  GetAllProductsOutput,
  GetProductByIdOutput,
  UpdateProductByIdInput,
  UpdateProductByIdOutput,
} from '../interfaces/services/product-service';
import { ProductPath } from '../enums/api/product';
import { CreateProduct } from '../interfaces/create-product';
import { Product } from '../models/product';
import { Price } from '../models/price';

describe('ProductService', () => {
  let service: ProductService;
  let requestServiceSpy: jasmine.SpyObj<RequestService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('RequestService', [
      'getRequest',
      'postRequest',
      'putRequest',
    ]);

    TestBed.configureTestingModule({
      providers: [ProductService, { provide: RequestService, useValue: spy }],
    });

    service = TestBed.inject(ProductService);
    requestServiceSpy = TestBed.inject(
      RequestService
    ) as jasmine.SpyObj<RequestService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProducts', () => {
    it('debería llamar a getRequest y devolver los productos', (done: DoneFn) => {
      const mockResponse: GetAllProductsOutput = {
        products: [{ _id: 'prod-1' } as any],
        total: 1,
      };
      requestServiceSpy.getRequest.and.returnValue(of(mockResponse));

      service.getAllProducts({ limit: 5, page: 1 }).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        expect(requestServiceSpy.getRequest).toHaveBeenCalledWith({
          path: ProductPath.PRODUCT,
          query: { limit: '5', page: '1' },
        });
        done();
      });
    });

    it('debería manejar errores y devolver un objeto por defecto', (done: DoneFn) => {
      requestServiceSpy.getRequest.and.returnValue(throwError(() => new Error('Error')));

      service.getAllProducts({}).subscribe((result) => {
        expect(result).toEqual({
          products: [],
          total: 0,
          message: 'No se pudo consultar la lista de productos',
        });
        done();
      });
    });
  });

  describe('createProduct', () => {
    const newProduct: CreateProduct = { name: 'New Product', amount: 100, coin: 'USD' };

    it('debería llamar a postRequest y devolver instancias de Product y Price', (done: DoneFn) => {
      const mockResponse = {
        product: { _id: 'new-prod', name: 'New Product' },
        price: { _id: 'new-price', amount: 100 },
      };
      requestServiceSpy.postRequest.and.returnValue(of(mockResponse));

      service.createProduct(newProduct).subscribe((result) => {
        expect(result.product).toBeInstanceOf(Product);
        expect(result.price).toBeInstanceOf(Price);
        expect(result.product?._id).toBe('new-prod');
        expect(result.price?.amount).toBe(100);
        expect(requestServiceSpy.postRequest).toHaveBeenCalledWith({
          path: '/product',
          body: newProduct,
        });
        done();
      });
    });

    it('debería manejar errores y devolver un mensaje', (done: DoneFn) => {
      requestServiceSpy.postRequest.and.returnValue(throwError(() => new Error('Error')));

      service.createProduct(newProduct).subscribe((result) => {
        expect(result.message).toBe('No se pudo crear el producto');
        done();
      });
    });
  });

  describe('getProductById', () => {
    const productId = 'prod-123';

    it('debería llamar a getRequest y devolver el producto', (done: DoneFn) => {
      const mockResponse: GetProductByIdOutput = { product: { _id: productId } as any };
      requestServiceSpy.getRequest.and.returnValue(of(mockResponse));

      service.getProductById(productId).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        expect(requestServiceSpy.getRequest).toHaveBeenCalledWith({
          path: `/product/${productId}`,
        });
        done();
      });
    });

    it('debería manejar errores y devolver un mensaje', (done: DoneFn) => {
      requestServiceSpy.getRequest.and.returnValue(throwError(() => new Error('Error')));

      service.getProductById(productId).subscribe((result) => {
        expect(result.message).toBe('No se pudo obtener el producto');
        done();
      });
    });
  });

  describe('updateProductById', () => {
    const updateData: UpdateProductByIdInput = { productId: 'prod-456', data: { name: 'Updated Name', inStock: false} };

    it('debería manejar errores y devolver un mensaje', (done: DoneFn) => {
      requestServiceSpy.putRequest.and.returnValue(throwError(() => new Error('Error')));

      service.updateProductById(updateData).subscribe((result) => {
        expect(result.message).toBe('No se pudo actualizar el producto');
        expect(requestServiceSpy.putRequest).toHaveBeenCalledWith({
          path: `/product/${updateData.productId}`,
          body: updateData.data,
        });
        done();
      });
    });
  });
});
