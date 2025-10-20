import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { RequestService } from './request.service';
import { AuthorizationPath } from '../enums/api/authorization';
import { AuthServiceSignInOutput } from '../interfaces/services/auth-service';

describe('AuthService', () => {
  let service: AuthService;
  let requestServiceSpy: jasmine.SpyObj<RequestService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const reqSpy = jasmine.createSpyObj('RequestService', [
      'postRequest',
      'setToken',
      'getToken',
    ]);
    const rtrSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: RequestService, useValue: reqSpy },
        { provide: Router, useValue: rtrSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    requestServiceSpy = TestBed.inject(
      RequestService
    ) as jasmine.SpyObj<RequestService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signIn', () => {
    const signInData = { email: 'test@test.com', password: 'password123' };

    it('debería llamar a postRequest, guardar el token y navegar si el login es exitoso', (done: DoneFn) => {
      const mockResponse: AuthServiceSignInOutput = {
        authorization: 'fake-jwt-token',
      };
      requestServiceSpy.postRequest.and.returnValue(of(mockResponse));

      service.signIn(signInData).subscribe((result) => {
        expect(requestServiceSpy.postRequest).toHaveBeenCalledWith({
          path: AuthorizationPath.SIGN_IN,
          body: signInData,
        });
        expect(requestServiceSpy.setToken).toHaveBeenCalledWith('fake-jwt-token');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
        expect(result.authorization).toBe('fake-jwt-token');
        done(); // La prueba de éxito no necesita cambios
      });
    });

    it('debería manejar el error de la petición y devolver un mensaje', (done: DoneFn) => {
      requestServiceSpy.postRequest.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      service.signIn(signInData).subscribe((result) => {
        expect(result.message).toBe('Email o clave invalido');
        expect(requestServiceSpy.setToken).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        done();
      });
    });

    it('no debería guardar el token ni navegar si la respuesta no tiene authorization', (done: DoneFn) => {
      const mockResponse: AuthServiceSignInOutput = { message: 'No token' };
      requestServiceSpy.postRequest.and.returnValue(of(mockResponse));

      service.signIn(signInData).subscribe(() => {
        expect(requestServiceSpy.setToken).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('getToken', () => {
    it('debería devolver el token desde RequestService', () => {
      requestServiceSpy.getToken.and.returnValue('my-token');
      expect(service.getToken()).toBe('my-token');
      expect(requestServiceSpy.getToken).toHaveBeenCalled();
    });
  });

  describe('isValidToken', () => {
    it('debería devolver true si hay un token', () => {
      requestServiceSpy.getToken.and.returnValue('some-valid-token');
      expect(service.isValidToken()).toBeTrue();
    });

    it('debería devolver false si no hay un token', () => {
      requestServiceSpy.getToken.and.returnValue('');
      expect(service.isValidToken()).toBeFalse();
    });
  });
});
