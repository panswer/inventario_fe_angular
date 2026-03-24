import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Location } from '@angular/common';

import { CreateBillComponent } from './create-bill.component';
import { StockService } from '../../../services/stock.service';
import { BillService } from '../../../services/bill.service';

const mockStocks = [
  {
    _id: 'stock-1',
    quantity: 10,
    minQuantity: 2,
    productId: { _id: 'prod-1', name: 'Laptop', inStock: true, categories: [] },
    warehouseId: { _id: 'wh-1', name: 'Warehouse 1', address: 'Address 1', isEnabled: true },
    price: { _id: 'price-1', amount: 1200, coin: 'USD', productId: 'prod-1', createdBy: 'user', createdAt: 123, updatedAt: 123 }
  },
  {
    _id: 'stock-2',
    quantity: 50,
    minQuantity: 5,
    productId: { _id: 'prod-2', name: 'Mouse', inStock: true, categories: [] },
    warehouseId: { _id: 'wh-1', name: 'Warehouse 1', address: 'Address 1', isEnabled: true },
    price: { _id: 'price-2', amount: 50, coin: 'EUR', productId: 'prod-2', createdBy: 'user', createdAt: 123, updatedAt: 123 }
  },
];

describe('CreateBillComponent', () => {
  let component: CreateBillComponent;
  let fixture: ComponentFixture<CreateBillComponent>;
  let stockServiceSpy: jasmine.SpyObj<StockService>;
  let billServiceSpy: jasmine.SpyObj<BillService>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    stockServiceSpy = jasmine.createSpyObj('StockService', ['getAllStocks']);
    billServiceSpy = jasmine.createSpyObj('BillService', ['createBill']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    stockServiceSpy.getAllStocks.and.returnValue(
      of({ stocks: mockStocks as any[], total: 2 })
    );
    billServiceSpy.createBill.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [CreateBillComponent, ReactiveFormsModule],
      providers: [
        { provide: StockService, useValue: stockServiceSpy },
        { provide: BillService, useValue: billServiceSpy },
        { provide: Location, useValue: locationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBillComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debería cargar stocks', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(stockServiceSpy.getAllStocks).toHaveBeenCalledWith({});
    expect(component.allStocks.length).toBe(2);
    expect(component.availableStocks.length).toBe(2);
  }));

  describe('Manejo del carrito de compras', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('handlerAddProduct debería agregar un stock al carrito y actualizar la lista', () => {
      component.mainFormGroup.patchValue({
        stock: 'stock-1',
        count: 2,
      });

      component.handlerAddProduct();

      expect(component.shoppingCar.length).toBe(1);
      expect(component.shoppingCar[0].value['stockId']).toBe('stock-1');
      expect(component.availableStocks.length).toBe(1);
      expect(component.availableStocks[0]._id).toBe('stock-2');
      expect(component.mainFormGroup.value).toEqual({
        stock: '',
        count: null,
      });
    });

    it('deleteShoppingItem debería eliminar un stock del carrito', () => {
      component.mainFormGroup.patchValue({ stock: 'stock-1', count: 1 });
      component.handlerAddProduct();
      component.mainFormGroup.patchValue({ stock: 'stock-2', count: 2 });
      component.handlerAddProduct();

      expect(component.shoppingCar.length).toBe(2);

      const itemToDelete = component.shoppingCar[0];
      component.deleteShoppingItem(itemToDelete);

      expect(component.shoppingCar.length).toBe(1);
      expect(component.shoppingCar[0].value['stockId']).toBe('stock-2');
      expect(component.availableStocks.length).toBe(1);
      expect(component.availableStocks[0]._id).toBe('stock-1');
    });
  });

  describe('handlerSubmitBill', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
      component.mainFormGroup.patchValue({ stock: 'stock-1', count: 2 });
      component.handlerAddProduct();
    }));

    it('debería llamar a billService.createBill con los datos correctos', () => {
      component.handlerSubmitBill();

      const expectedPayload = {
        sellers: [
          { stockId: 'stock-1', count: 2, coin: 'USD' },
        ],
      };
      expect(billServiceSpy.createBill).toHaveBeenCalledWith(expectedPayload);
    });

    it('debería mostrar alerta de éxito, limpiar el carrito y habilitar el form si no hay mensaje de error', fakeAsync(() => {
      spyOn(window, 'alert');
      billServiceSpy.createBill.and.returnValue(of({}));

      component.handlerSubmitBill();
      tick();

      expect(window.alert).toHaveBeenCalledWith('Se guardo la orden');
      expect(component.shoppingCar.length).toBe(0);
      expect(component.mainFormGroup.enabled).toBeTrue();
    }));

    it('debería mostrar alerta de error si el servicio devuelve un mensaje', fakeAsync(() => {
      spyOn(window, 'alert');
      billServiceSpy.createBill.and.returnValue(of({ message: 'Error en el servidor' }));

      component.handlerSubmitBill();
      tick();

      expect(window.alert).toHaveBeenCalledWith('No se pudo guardar la orden');
      expect(component.mainFormGroup.enabled).toBeTrue();
    }));
  });

  it('getStockProductName debería retornar el nombre del producto', () => {
    fixture.detectChanges();
    
    expect(component.getStockProductName('stock-1')).toBe('Laptop');
    expect(component.getStockProductName('stock-2')).toBe('Mouse');
    expect(component.getStockProductName('invalid')).toBe('');
  });

  it('handlerBack debería llamar a location.back', () => {
    component.handlerBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
