import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { CreateProductComponent } from './create-product.component';
import { ProductService } from '../../../services/product.service';
import { PriceService } from '../../../services/price.service';

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let priceServiceSpy: jasmine.SpyObj<PriceService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['createProduct']);
    priceServiceSpy = jasmine.createSpyObj('PriceService', ['getAllCoins']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    priceServiceSpy.getAllCoins.and.returnValue(of(['USD', 'EUR']));

    await TestBed.configureTestingModule({
      imports: [CreateProductComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: PriceService, useValue: priceServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    // No llamar a detectChanges aquí para controlar ngOnInit
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOnInit debería cargar la lista de monedas y establecer isLoading en false', () => {
    expect(component.isLoading).toBeTrue();

    fixture.detectChanges(); // Llama a ngOnInit

    expect(priceServiceSpy.getAllCoins).toHaveBeenCalled();
    expect(component.coinList).toEqual(['USD', 'EUR']);
    expect(component.isLoading).toBeFalse();
  });

  it('goBack debería navegar a la ruta raíz', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
  });

  describe('handlerSubmit', () => {
    beforeEach(() => {
      fixture.detectChanges(); // Para que el formulario y los datos iniciales estén listos
    });

    it('no debería llamar a createProduct si el formulario es inválido', () => {
      component.handlerSubmit();
      expect(productServiceSpy.createProduct).not.toHaveBeenCalled();
    });

    it('debería llamar a createProduct y mostrar alerta de éxito', fakeAsync(() => {
      spyOn(window, 'alert');
      productServiceSpy.createProduct.and.returnValue(
        of({ product: {} as any, price: {} as any })
      );

      component.productForm.setValue({
        name: 'Test Product',
        amount: 100,
        coin: 'USD',
      });

      component.handlerSubmit();

      expect(productServiceSpy.createProduct).toHaveBeenCalledWith({
        name: 'Test Product',
        amount: 100,
        coin: 'USD',
      });

      tick(); // Simula el paso del tiempo para el observable

      expect(window.alert).toHaveBeenCalledWith('Se creo el producto');
      expect(component.productForm.value).toEqual({ name: '', amount: 0, coin: '' });
      expect(component.isLoading).toBeFalse();
    }));

    it('debería llamar a createProduct y mostrar alerta de error', fakeAsync(() => {
      spyOn(window, 'alert');
      productServiceSpy.createProduct.and.returnValue(
        of({ message: 'Error al crear' })
      );

      component.productForm.setValue({
        name: 'Test Product',
        amount: 100,
        coin: 'USD',
      });

      component.handlerSubmit();
      tick();

      expect(window.alert).toHaveBeenCalledWith('Error al crear');
      expect(component.isLoading).toBeFalse();
    }));
  });

  it('handlerPreventEvent debería prevenir la acción por defecto del evento', () => {
    const mockEvent = jasmine.createSpyObj('Event', ['preventDefault']);
    component.handlerPreventEvent(mockEvent);
    fixture.detectChanges();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
