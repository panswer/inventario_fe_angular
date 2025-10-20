import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductDataComponent } from './product-data.component';
import { ProductService } from '../../../services/product.service';
import { PriceService } from '../../../services/price.service';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { Product } from '../../../models/product';
import { Price } from '../../../models/price';

describe('ProductDataComponent', () => {
  let component: ProductDataComponent;
  let fixture: ComponentFixture<ProductDataComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let priceServiceSpy: jasmine.SpyObj<PriceService>;
  let locationSpy: jasmine.SpyObj<Location>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  const mockProduct = { _id: 'prod-123', name: 'Test Product', inStock: true };
  const mockPrice = { _id: 'price-456', amount: 99.99, coin: 'USD', productId: 'prod-123' };

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductById', 'updateProductById']);
    priceServiceSpy = jasmine.createSpyObj('PriceService', ['getPriceByProductId', 'getAllCoins', 'updatePriceById']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'prod-123',
        },
      } as any,
    };

    // Configurar respuestas por defecto de los spies
    productServiceSpy.getProductById.and.returnValue(of({ product: mockProduct as any }));
    priceServiceSpy.getPriceByProductId.and.returnValue(of({ price: mockPrice as any }));
    priceServiceSpy.getAllCoins.and.returnValue(of(['USD', 'EUR']));

    await TestBed.configureTestingModule({
      imports: [ProductDataComponent, ReactiveFormsModule, ButtonComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: PriceService, useValue: priceServiceSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDataComponent);
    component = fixture.componentInstance;
    // No llamar a detectChanges() aquí para controlar la llamada a ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debería obtener el productId y cargar el producto', () => {
    spyOn(component, 'loadProduct');
    fixture.detectChanges(); // Esto dispara ngOnInit
    expect((component as any).productId).toBe('prod-123');
    expect(component.loadProduct).toHaveBeenCalled();
  });

  it('loadProduct debería cargar los datos del producto y el formulario, y luego llamar a loadPrice', () => {
    fixture.detectChanges();

    expect(productServiceSpy.getProductById).toHaveBeenCalledWith('prod-123');
    expect(component.productForm.value).toEqual({ name: 'Test Product', inStock: true });
    expect(priceServiceSpy.getPriceByProductId).toHaveBeenCalledWith('prod-123');
  });

  it('loadPrice debería cargar los datos del precio, el formulario y la lista de monedas', () => {
    fixture.detectChanges();

    expect(priceServiceSpy.getPriceByProductId).toHaveBeenCalledWith('prod-123');
    expect(component.priceForm.value).toEqual({ amount: 99.99, coin: 'USD' });
    expect(priceServiceSpy.getAllCoins).toHaveBeenCalled();
    expect(component.coinList).toEqual(['USD', 'EUR']);
    expect(component.isLoading).toBeFalse();
  });

  it('goBack debería llamar a location.back', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  describe('handlerSubmitProduct', () => {
    beforeEach(() => {
      fixture.detectChanges(); // Cargar datos iniciales
    });

    it('no debería hacer nada si el formulario es inválido', () => {
      component.productForm.controls.name.setValue(''); // Hacer el form inválido
      component.handlerSubmitProduct();
      expect(productServiceSpy.updateProductById).not.toHaveBeenCalled();
    });

    it('debería llamar a updateProductById con los datos del formulario si es válido', fakeAsync(() => {
      const updatedProduct = { ...mockProduct, name: 'Updated Product' };
      productServiceSpy.updateProductById.and.returnValue(of({ product: updatedProduct as any }));

      component.productForm.controls.name.setValue('Updated Product');
      component.handlerSubmitProduct();

      expect(productServiceSpy.updateProductById).toHaveBeenCalledWith({
        productId: 'prod-123',
        data: { name: 'Updated Product', inStock: true },
      });

      tick(); // Simular el paso del tiempo para que el observable se complete

      expect((component as any).product.name).toBe('Updated Product');
      expect(component.isLoading).toBeFalse();
    }));

    it('debería mostrar una alerta si hay un mensaje de error', () => {
      spyOn(window, 'alert');
      productServiceSpy.updateProductById.and.returnValue(of({ message: 'Error al actualizar' }));

      component.handlerSubmitProduct();

      expect(window.alert).toHaveBeenCalledWith('Error al actualizar');
    });
  });

  describe('handlerSubmitPrice', () => {
    beforeEach(() => {
      fixture.detectChanges(); // Cargar datos iniciales
    });

    it('no debería hacer nada si el formulario es inválido', () => {
      component.priceForm.controls.amount.setValue(-10); // Hacer el form inválido
      component.handlerSubmitPrice();
      expect(priceServiceSpy.updatePriceById).not.toHaveBeenCalled();
    });

    it('debería llamar a updatePriceById con los datos del formulario si es válido', fakeAsync(() => {
      const updatedPrice = { ...mockPrice, amount: 120.50 };
      priceServiceSpy.updatePriceById.and.returnValue(of({ price: updatedPrice as any }));

      // Actualizamos los valores del formulario
      component.priceForm.controls.amount.setValue(120.50);
      component.priceForm.controls.coin.setValue('EUR');
      component.handlerSubmitPrice();

      expect(priceServiceSpy.updatePriceById).toHaveBeenCalledWith({
        priceId: 'price-456',
        data: { amount: 120.50 }, // El amount se actualiza desde el form
        coin: 'EUR', // La moneda también se actualiza desde el form
      });

      tick(); // Simular el paso del tiempo

      expect((component as any).price.amount).toBe(120.50);
      expect(component.isLoading).toBeFalse();
    }));

    it('debería mostrar una alerta si hay un mensaje de error', () => {
      spyOn(window, 'alert');
      priceServiceSpy.updatePriceById.and.returnValue(of({ message: 'Error de precio' }));

      component.handlerSubmitPrice();

      expect(window.alert).toHaveBeenCalledWith('Error de precio');
    });
  });
});
