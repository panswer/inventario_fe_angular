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
import { ProductService } from '../../../services/product.service';
import { PriceService } from '../../../services/price.service';
import { BillService } from '../../../services/bill.service';
import { Product } from '../../../models/product';

// Mock data
const mockProducts = [
  { _id: 'prod-1', name: 'Laptop', inStock: true },
  { _id: 'prod-2', name: 'Mouse', inStock: true },
];
const mockPrice1 = { _id: 'price-1', amount: 1200, coin: 'USD' };
const mockPrice2 = { _id: 'price-2', amount: 50, coin: 'USD' };

describe('CreateBillComponent', () => {
  let component: CreateBillComponent;
  let fixture: ComponentFixture<CreateBillComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let priceServiceSpy: jasmine.SpyObj<PriceService>;
  let billServiceSpy: jasmine.SpyObj<BillService>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getAllProducts',
    ]);
    priceServiceSpy = jasmine.createSpyObj('PriceService', [
      'getPriceByProductId',
    ]);
    billServiceSpy = jasmine.createSpyObj('BillService', ['createBill']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    // Configurar respuestas por defecto
    productServiceSpy.getAllProducts.and.returnValue(
      of({ products: mockProducts as any[], total: 2 })
    );
    priceServiceSpy.getPriceByProductId.and.callFake((id) => {
      if (id === 'prod-1') return of({ price: mockPrice1 as any });
      if (id === 'prod-2') return of({ price: mockPrice2 as any });
      return of({ price: null });
    });
    billServiceSpy.createBill.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [CreateBillComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: PriceService, useValue: priceServiceSpy },
        { provide: BillService, useValue: billServiceSpy },
        { provide: Location, useValue: locationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBillComponent);
    component = fixture.componentInstance;
    // No llamar a detectChanges() aquí para controlar ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debería cargar productos y precios', fakeAsync(() => {
    fixture.detectChanges();
    tick(); // Para que se resuelvan las promesas de loadPrices

    expect(productServiceSpy.getAllProducts).toHaveBeenCalledWith({});
    expect(component.allProducts.length).toBe(2);
    expect(component.allProducts[0]).toBeInstanceOf(Product);
    expect(priceServiceSpy.getPriceByProductId).toHaveBeenCalledWith('prod-1');
    expect(priceServiceSpy.getPriceByProductId).toHaveBeenCalledWith('prod-2');
    expect(component.allProducts[0].price?.amount).toBe(1200);
    expect(component.products.length).toBe(2); // Al inicio, todos están disponibles
  }));

  it('handlerChangeCount debería actualizar el subtotal', () => {
    fixture.detectChanges(); // Carga los productos

    component.mainFormGroup.controls.product.setValue('prod-1');
    component.mainFormGroup.controls.count.setValue(3);

    expect(component.mainFormGroup.controls.subTotal.value).toBe(3600); // 3 * 1200
  });

  describe('Manejo del carrito de compras', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('handlerAddProduct debería agregar un producto al carrito y actualizar la lista', () => {
      component.mainFormGroup.patchValue({
        product: 'prod-1',
        count: 2,
        subTotal: 2400,
      });

      component.handlerAddProduct();

      expect(component.shoppingCar.length).toBe(1);
      expect(component.shoppingCar[0].value.product).toBe('prod-1');
      expect(component.total).toBe(2400);
      expect(component.products.length).toBe(1); // Solo queda el mouse
      expect(component.products[0]._id).toBe('prod-2');
      expect(component.mainFormGroup.value).toEqual({
        product: '',
        count: 0,
        subTotal: 0,
      });
    });

    it('deleteShoppingItem debería eliminar un producto del carrito', () => {
      // Añadir dos productos
      component.mainFormGroup.patchValue({ product: 'prod-1', count: 1, subTotal: 1200 });
      component.handlerAddProduct();
      component.mainFormGroup.patchValue({ product: 'prod-2', count: 2, subTotal: 100 });
      component.handlerAddProduct();

      expect(component.shoppingCar.length).toBe(2);
      expect(component.total).toBe(1300);

      // Eliminar el primer producto
      const itemToDelete = component.shoppingCar[0];
      component.deleteShoppingItem(itemToDelete);

      expect(component.shoppingCar.length).toBe(1);
      expect(component.shoppingCar[0].value.product).toBe('prod-2');
      expect(component.total).toBe(100);
      expect(component.products.length).toBe(1); // Vuelve a estar disponible el prod-1
      expect(component.products[0]._id).toBe('prod-1');
    });

    it('cambiar la cantidad en un item del carrito debería actualizar el total', () => {
      component.mainFormGroup.patchValue({ product: 'prod-1', count: 1, subTotal: 1200 });
      component.handlerAddProduct();

      const shoppingItem = component.shoppingCar[0];
      shoppingItem.controls['count'].setValue(3);

      expect(shoppingItem.controls['subTotal'].value).toBe(3600);
      expect(component.total).toBe(3600);
    });
  });

  describe('handlerSubmitBill', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
      // Añadir un item al carrito
      component.mainFormGroup.patchValue({ product: 'prod-1', count: 2, subTotal: 2400 });
      component.handlerAddProduct();
    }));

    it('debería llamar a billService.createBill con los datos correctos', () => {
      component.handlerSubmitBill();

      const expectedPayload = {
        sellers: [
          { productId: 'prod-1', count: 2, price: 1200, coin: 'USD' },
        ],
      };
      expect(billServiceSpy.createBill).toHaveBeenCalledWith(expectedPayload);
    });

    it('debería mostrar alerta de éxito, limpiar el carrito y habilitar el form si no hay mensaje de error', fakeAsync(() => {
      spyOn(window, 'alert');
      billServiceSpy.createBill.and.returnValue(of({})); // Respuesta exitosa

      component.handlerSubmitBill();
      tick();

      expect(window.alert).toHaveBeenCalledWith('Se guardo la orden');
      expect(component.shoppingCar.length).toBe(0);
      expect(component.total).toBe(0);
      expect(component.mainFormGroup.enabled).toBeTrue();
    }));

    it('debería mostrar alerta de error si el servicio devuelve un mensaje', fakeAsync(() => {
      spyOn(window, 'alert');
      billServiceSpy.createBill.and.returnValue(of({ message: 'Error en el servidor' }));

      component.handlerSubmitBill();
      tick();

      expect(window.alert).toHaveBeenCalledWith('No se pudo guardar la orden');
      expect(component.mainFormGroup.enabled).toBeTrue(); // Se debe re-habilitar
    }));
  });

  it('handlerBack debería llamar a location.back', () => {
    component.handlerBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
