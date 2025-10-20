import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { GetAllProductsOutput } from '../../../interfaces/services/product-service';

import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getAllProducts',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const mockProductsResponse: GetAllProductsOutput = {
      products: [
        {
          _id: 'prod-1',
          name: 'Product 1',
          inStock: true,
          createdAt: Date.now(),
          createdBy: 'user-1',
          updatedAt: Date.now(),
        },
      ],
      total: 1,
    };

    productServiceSpy.getAllProducts.and.returnValue(of(mockProductsResponse));

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    // No llamar a detectChanges aquí para controlar ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debería llamar a getAllProducts y poblar los productos', () => {
    fixture.detectChanges();

    expect(productServiceSpy.getAllProducts).toHaveBeenCalledWith(
      component.pageData
    );
    expect(component.products.length).toBe(1);
    expect(component.products[0]._id).toBe('prod-1');
    expect(component.productTotal).toBe(1);
  });

  it('ngOnInit debería mostrar una alerta si la respuesta contiene un mensaje', () => {
    const mockResponseWithMessage: GetAllProductsOutput = {
      products: [],
      total: 0,
      message: 'Error al cargar productos',
    };
    productServiceSpy.getAllProducts.and.returnValue(of(mockResponseWithMessage));
    spyOn(window, 'alert');

    fixture.detectChanges();

    expect(window.alert).toHaveBeenCalledWith('Error al cargar productos');
  });

  it('goToCreateProduct debería navegar a /product/new', () => {
    component.goToCreateProduct();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/product/new']);
  });

  it('goToProductData debería navegar a /product/:id', () => {
    component.goToProductData('prod-xyz');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/product', 'prod-xyz']);
  });

  it('goToSeller debería navegar a seller', () => {
    component.goToSeller();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['seller']);
  });
});
