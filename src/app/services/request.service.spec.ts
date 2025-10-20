import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { RequestService } from './request.service';
import { environment } from '../../environments/environment';

describe('RequestService', () => {
  let service: RequestService;
  let httpTestingController: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  const authTokenKey = 'Authorization';

  beforeEach(() => {
    const rtrSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestService, { provide: Router, useValue: rtrSpy }],
    });

    // Limpiar sessionStorage ANTES de inyectar el servicio
    sessionStorage.clear();

    service = TestBed.inject(RequestService);
    httpTestingController = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    // Verificar que no haya peticiones pendientes
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Manejo de Token', () => {
    it('debería guardar el token en sessionStorage al usar setToken', () => {
      const testToken = 'my-fake-token';
      service.setToken(testToken);
      expect(sessionStorage.getItem(authTokenKey)).toBe(testToken);
    });

    it('debería devolver el token guardado con getToken', () => {
      const testToken = 'my-fake-token-2';
      service.setToken(testToken);
      expect(service.getToken()).toBe(testToken);
    });

    it('debería eliminar el token de sessionStorage al usar logout', () => {
      service.setToken('token-to-be-deleted');
      service.logout();
      expect(sessionStorage.getItem(authTokenKey)).toBeNull();
      expect(service.getToken()).toBe('');
    });

    // Esta prueba necesita su propia configuración para probar el constructor
    describe('cuando el token ya existe en sessionStorage', () => {
      it('debería inicializar el servicio con dicho token', () => {
        // 1. Configurar el estado ANTES de que se cree el servicio
        sessionStorage.setItem(authTokenKey, 'existing-token');

        // 2. Destruir el módulo de pruebas actual para forzar la creación de una nueva instancia del servicio
        TestBed.resetTestingModule();

        // 3. Reconfigurar el TestBed para esta prueba específica
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          providers: [RequestService, { provide: Router, useValue: routerSpy }],
        });

        // 4. Inyectar la NUEVA instancia del servicio, que ahora leerá el sessionStorage
        service = TestBed.inject(RequestService);

        expect(service.getToken()).toBe('existing-token');
      });
    });
  });

  describe('Peticiones HTTP', () => {
    it('getRequest debería enviar una petición GET sin token de autorización', () => {
      const path = '/test';
      service.getRequest({ path }).subscribe();

      const req = httpTestingController.expectOne(`${environment.apiUrl}${path}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has(authTokenKey)).toBeFalse();
      req.flush({});
    });

    it('getRequest debería enviar una petición GET con token de autorización', () => {
      const path = '/secure-test';
      const token = 'my-secure-token';
      service.setToken(token);

      service.getRequest({ path }).subscribe();

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}${path}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get(authTokenKey)).toBe(`Bearer ${token}`);
      req.flush({});
    });

    it('getRequest debería construir la URL con query params', () => {
      const path = '/search';
      const query = { q: 'test', page: '1' };
      service.getRequest({ path, query }).subscribe();

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}${path}?q=test&page=1`
      );
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('postRequest debería enviar una petición POST con el body correcto', () => {
      const path = '/create';
      const body = { name: 'new item' };
      service.postRequest({ path, body }).subscribe();

      const req = httpTestingController.expectOne(`${environment.apiUrl}${path}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush({});
    });

    it('putRequest debería enviar una petición PUT con el body correcto', () => {
      const path = '/update/1';
      const body = { name: 'updated item' };
      service.putRequest({ path, body }).subscribe();

      const req = httpTestingController.expectOne(`${environment.apiUrl}${path}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush({});
    });
  });

  describe('Manejo de Errores y Status', () => {
    it('debería llamar a logout y navegar a /login en un error 401', () => {
      const path = '/protected';
      service.setToken('some-token');

      service.getRequest({ path }).subscribe({
        error: (err) => {
          expect(err.status).toBe(401);
        },
      });

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}${path}`
      );
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(service.getToken()).toBe('');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
    });

    it('debería llamar a logout y navegar a /login en un error 403', () => {
      const path = '/forbidden';
      service.setToken('some-token');

      service.getRequest({ path }).subscribe({
        error: (err) => {
          expect(err.status).toBe(403);
        },
      });

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}${path}`
      );
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

      expect(service.getToken()).toBe('');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
    });
  });
});
