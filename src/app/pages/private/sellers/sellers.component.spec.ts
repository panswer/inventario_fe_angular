import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { SellersComponent } from './sellers.component';
import { BillService } from '../../../services/bill.service';
import { GetBillsOutput } from '../../../interfaces/services/bill-service';
import { Bill } from '../../../models/bill';

describe('SellersComponent', () => {
  let component: SellersComponent;
  let fixture: ComponentFixture<SellersComponent>;
  let billServiceSpy: jasmine.SpyObj<BillService>;
  let locationSpy: jasmine.SpyObj<Location>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    billServiceSpy = jasmine.createSpyObj('BillService', ['getBills']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const mockBillsResponse: GetBillsOutput = {
      bills: [
        {
          _id: 'bill-1',
          userId: 'user-1',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      total: 1,
    };
    billServiceSpy.getBills.and.returnValue(of(mockBillsResponse));

    await TestBed.configureTestingModule({
      imports: [SellersComponent],
      providers: [
        { provide: BillService, useValue: billServiceSpy },
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SellersComponent);
    component = fixture.componentInstance;
    // No llamar a detectChanges aquí para controlar ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debería llamar a loadBill y poblar las facturas', () => {
    fixture.detectChanges();

    expect(billServiceSpy.getBills).toHaveBeenCalledWith({});
    expect(component.bills.length).toBe(1);
    expect(component.bills[0]).toBeInstanceOf(Bill);
    expect(component.bills[0]._id).toBe('bill-1');
    expect(component.billTotal).toBe(1);
  });

  it('loadBill debería mostrar una alerta si la respuesta contiene un mensaje', () => {
    const mockResponseWithMessage: GetBillsOutput = {
      bills: [],
      total: 0,
      message: 'Error al cargar facturas',
    };
    billServiceSpy.getBills.and.returnValue(of(mockResponseWithMessage));
    spyOn(window, 'alert');

    fixture.detectChanges(); // Esto llama a ngOnInit -> loadBill

    expect(window.alert).toHaveBeenCalledWith('Error al cargar facturas');
  });

  it('goBack debería llamar a location.back', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('goToCreateBill debería navegar a /seller/create', () => {
    component.goToCreateBill();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/seller/create']);
  });

  it('goToBillDetail debería navegar a /seller/:id', () => {
    component.goToBillDetail('bill-xyz');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/seller/', 'bill-xyz']);
  });
});
