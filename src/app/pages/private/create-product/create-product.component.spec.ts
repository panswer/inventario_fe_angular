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
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOnInit debería cargar la lista de monedas y establecer isLoading en false', () => {
    expect(component.isLoading()).toBeTrue();
    fixture.detectChanges();
    expect(priceServiceSpy.getAllCoins).toHaveBeenCalled();
    expect(component.coinList).toEqual(['USD', 'EUR']);
    expect(component.isLoading()).toBeFalse();
  });

  it('goBack debería navegar a la ruta raíz', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
  });

  describe('handlerSubmit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('no debería llamar a createProduct si el formulario es inválido', () => {
      component.handlerSubmit();
      expect(productServiceSpy.createProduct).not.toHaveBeenCalled();
    });

    it('debería llamar a createProduct y mostrar alerta de éxito', fakeAsync(() => {
      spyOn(window, 'alert');
      productServiceSpy.createProduct.and.returnValue(
        of({ product: {} as never, price: {} as never })
      );

      component.productForm.setValue({
        name: 'Test Product',
        amount: 100,
        coin: 'USD',
        barcode: '',
      });

      component.handlerSubmit();

      expect(productServiceSpy.createProduct).toHaveBeenCalledWith({
        name: 'Test Product',
        amount: 100,
        coin: 'USD',
        barcode: undefined,
        categories: undefined,
      });

      tick();

      expect(window.alert).toHaveBeenCalledWith('Se creo el producto');
      expect(component.productForm.value).toEqual({ name: '', amount: 0, coin: '', barcode: '' });
      expect(component.isLoading()).toBeFalse();
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
        barcode: '',
      });

      component.handlerSubmit();
      tick();

      expect(window.alert).toHaveBeenCalledWith('Error al crear');
      expect(component.isLoading()).toBeFalse();
    }));
  });
});
