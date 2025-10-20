import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { BillService } from './bill.service';
import { RequestService } from './request.service';
import {
  CreateBillInput,
  CreateBillOutput,
  GetBillDetailByBillIdOutput,
  GetBillsOutput,
} from '../interfaces/services/bill-service';

describe('BillService', () => {
  let service: BillService;
  let requestServiceSpy: jasmine.SpyObj<RequestService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('RequestService', [
      'getRequest',
      'postRequest',
    ]);

    TestBed.configureTestingModule({
      providers: [BillService, { provide: RequestService, useValue: spy }],
    });

    service = TestBed.inject(BillService);
    requestServiceSpy = TestBed.inject(
      RequestService
    ) as jasmine.SpyObj<RequestService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBills', () => {
    it('debería llamar a getRequest y devolver las facturas', (done: DoneFn) => {
      const mockResponse: GetBillsOutput = {
        bills: [{ _id: 'bill-1', userId: 'user-1' } as any],
        total: 1,
      };
      requestServiceSpy.getRequest.and.returnValue(of(mockResponse));

      service.getBills({ limit: 10, page: 1 }).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        expect(requestServiceSpy.getRequest).toHaveBeenCalledWith({
          path: '/bill',
          query: { limit: '10', page: '1' },
        });
        done();
      });
    });

    it('debería manejar errores y devolver un objeto por defecto', (done: DoneFn) => {
      requestServiceSpy.getRequest.and.returnValue(throwError(() => new Error('Error')));

      service.getBills({}).subscribe((result) => {
        expect(result).toEqual({
          bills: [],
          total: 0,
          message: 'Unknown error',
        });
        done();
      });
    });
  });

  describe('createBill', () => {
    it('debería llamar a postRequest y crear una factura', (done: DoneFn) => {
      const mockInput: CreateBillInput = { sellers: [] };
      const mockResponse: CreateBillOutput = {};
      requestServiceSpy.postRequest.and.returnValue(of(mockResponse));

      service.createBill(mockInput).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        expect(requestServiceSpy.postRequest).toHaveBeenCalledWith({
          path: '/bill',
          body: mockInput,
        });
        done();
      });
    });

    it('debería manejar errores y devolver un mensaje', (done: DoneFn) => {
      requestServiceSpy.postRequest.and.returnValue(throwError(() => new Error('Error')));

      service.createBill({ sellers: [] }).subscribe((result) => {
        expect(result.message).toBe("Couldn't create bill success");
        done();
      });
    });
  });

  describe('getBillDetailById', () => {
    it('debería llamar a getRequest y devolver los detalles de la factura', (done: DoneFn) => {
      const billId = 'bill-123';
      const mockResponse = { billDetail: { _id: billId } as any };
      const expectedOutput: GetBillDetailByBillIdOutput = { bill: mockResponse.billDetail };
      requestServiceSpy.getRequest.and.returnValue(of(mockResponse));

      service.getBillDetailById(billId).subscribe((result) => {
        expect(result).toEqual(expectedOutput);
        expect(requestServiceSpy.getRequest).toHaveBeenCalledWith({
          path: `/bill/detail/${billId}`,
        });
        done();
      });
    });

    it('debería manejar errores y devolver un mensaje', (done: DoneFn) => {
      const billId = 'bill-123';
      requestServiceSpy.getRequest.and.returnValue(throwError(() => new Error('Error')));

      service.getBillDetailById(billId).subscribe((result) => {
        expect(result.message).toBe('No se pudo obtener la orden de compra');
        done();
      });
    });
  });
});
