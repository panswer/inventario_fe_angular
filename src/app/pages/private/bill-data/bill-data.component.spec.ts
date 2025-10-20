import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Location } from '@angular/common';

import { BillDataComponent } from './bill-data.component';
import { BillService } from '../../../services/bill.service';
import { Bill } from '../../../models/bill';
import { GetBillDetailByBillIdOutput } from '../../../interfaces/services/bill-service';

describe('BillDataComponent', () => {
  let component: BillDataComponent;
  let fixture: ComponentFixture<BillDataComponent>;
  let billServiceSpy: jasmine.SpyObj<BillService>;
  let locationSpy: jasmine.SpyObj<Location>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  const mockBillId = 'bill-123';
  const mockBillResponse: GetBillDetailByBillIdOutput = {
    bill: {
      _id: mockBillId,
      userId: 'user-abc',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sales: [{ _id: 'sale-1', count: 2, price: 10, createdAt: Date.now(), updatedAt: Date.now(), productId: 'product-xyz' , userId: 'user-abc'}],
      total: 20,
    },
  };

  beforeEach(async () => {
    billServiceSpy = jasmine.createSpyObj('BillService', ['getBillDetailById']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => mockBillId,
        },
      } as any,
    };

    // Configurar respuesta por defecto del spy
    billServiceSpy.getBillDetailById.and.returnValue(of(mockBillResponse));

    await TestBed.configureTestingModule({
      imports: [BillDataComponent],
      providers: [
        { provide: BillService, useValue: billServiceSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BillDataComponent);
    component = fixture.componentInstance;
    // No se llama a detectChanges aquí para tener control sobre ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debería obtener el billId y llamar a loadBillDetail', () => {
    spyOn(component, 'loadBillDetail'); // Espiamos el método antes de que se llame
    fixture.detectChanges();

    expect((component as any).billId).toBe(mockBillId);
    expect(component.loadBillDetail).toHaveBeenCalled();
  });

  it('loadBillDetail debería llamar al servicio y crear una instancia de Bill en caso de éxito', () => {
    fixture.detectChanges(); // Esto dispara ngOnInit y por ende loadBillDetail

    expect(billServiceSpy.getBillDetailById).toHaveBeenCalledWith(mockBillId);
    expect(component.bill).toBeInstanceOf(Bill);
    expect(component.bill?._id).toBe(mockBillId);
    expect(component.bill?.total).toBe(20);
    expect(component.bill?.sales.length).toBe(1);
  });

  it('loadBillDetail debería mostrar una alerta si el servicio devuelve un mensaje de error', () => {
    spyOn(window, 'alert');
    billServiceSpy.getBillDetailById.and.returnValue(of({ message: 'Factura no encontrada' }));

    fixture.detectChanges();

    expect(window.alert).toHaveBeenCalledWith('Factura no encontrada');
  });

  it('handlerBack debería llamar a location.back', () => {
    component.handlerBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
