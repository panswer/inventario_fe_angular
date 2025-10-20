import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { PriceService } from './price.service';
import { RequestService } from './request.service';
import {
  GetPriceByProductIdOutput,
  UpdatePriceByIdInput,
  UpdatePriceByIdOutput,
} from '../interfaces/services/price-service';

describe('PriceService', () => {
  let service: PriceService;
  let requestServiceSpy: jasmine.SpyObj<RequestService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('RequestService', [
      'getRequest',
      'putRequest',
    ]);

    TestBed.configureTestingModule({
      providers: [PriceService, { provide: RequestService, useValue: spy }],
    });

    service = TestBed.inject(PriceService);
    requestServiceSpy = TestBed.inject(
      RequestService
    ) as jasmine.SpyObj<RequestService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllCoins', () => {
    it('debería devolver un array de monedas en caso de éxito', (done: DoneFn) => {
      const mockCoins = ['USD', 'EUR', 'COP'];
      requestServiceSpy.getRequest.and.returnValue(of({ coins: mockCoins }));

      service.getAllCoins().subscribe((coins) => {
        expect(coins).toEqual(mockCoins);
        expect(requestServiceSpy.getRequest).toHaveBeenCalledWith({
          path: '/price/coin',
        });
        done();
      });
    });

    it('debería devolver un array vacío en caso de error', (done: DoneFn) => {
      requestServiceSpy.getRequest.and.returnValue(
        throwError(() => new Error('Network Error'))
      );

      service.getAllCoins().subscribe((coins) => {
        expect(coins).toEqual([]);
        done();
      });
    });
  });

  describe('getPriceByProductId', () => {
    const productId = 'prod-123';

    it('debería devolver el precio del producto en caso de éxito', (done: DoneFn) => {
      const mockResponse: GetPriceByProductIdOutput = {
        price: { _id: 'price-1', amount: 100 } as any,
      };
      requestServiceSpy.getRequest.and.returnValue(of(mockResponse));

      service.getPriceByProductId(productId).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        expect(requestServiceSpy.getRequest).toHaveBeenCalledWith({
          path: `/price/product/${productId}`,
        });
        done();
      });
    });

    it('debería devolver un mensaje de error en caso de fallo', (done: DoneFn) => {
      requestServiceSpy.getRequest.and.returnValue(
        throwError(() => new Error('Not Found'))
      );

      service.getPriceByProductId(productId).subscribe((result) => {
        expect(result.message).toBe('No se pudo obtener el precio');
        done();
      });
    });
  });

  describe('updatePriceById', () => {
    const updateData: UpdatePriceByIdInput = {
      priceId: 'price-456',
      data: { amount: 250 },
      coin: 'USD',
    };

    it('debería devolver un mensaje de error en caso de fallo al actualizar', (done: DoneFn) => {
      requestServiceSpy.putRequest.and.returnValue(throwError(() => new Error('Error')));

      service.updatePriceById(updateData).subscribe((result) => {
        expect(result.message).toBe('No se pudo actualizar el precio');
        done();
      });
    });
  });
});
