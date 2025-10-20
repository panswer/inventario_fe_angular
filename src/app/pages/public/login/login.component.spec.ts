import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isValidToken',
      'signIn',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería navegar a la página principal si el token ya es válido', () => {
      authServiceSpy.isValidToken.and.returnValue(true);
      fixture.detectChanges(); // Llama a ngOnInit
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });

    it('no debería navegar si el token no es válido', () => {
      authServiceSpy.isValidToken.and.returnValue(false);
      fixture.detectChanges();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('debería añadir los validadores de contraseña al formulario', () => {
      authServiceSpy.isValidToken.and.returnValue(false);
      fixture.detectChanges();
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('invalid');
      expect(component.loginForm.hasError('uppercase')).toBeTrue();
      expect(component.loginForm.hasError('num')).toBeTrue();
      expect(component.loginForm.hasError('specialChar')).toBeTrue();
    });
  });

  describe('handleSubmit', () => {
    beforeEach(() => {
      authServiceSpy.isValidToken.and.returnValue(false);
      fixture.detectChanges();
    });

    it('no debería llamar a signIn si el formulario es inválido', () => {
      const event = new Event('submit');
      component.handleSubmit(event);
      expect(authServiceSpy.signIn).not.toHaveBeenCalled();
    });

    it('debería llamar a signIn y navegar en un login exitoso', fakeAsync(() => {
      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'Password123!',
      });
      authServiceSpy.signIn.and.returnValue(
        of({ authorization: 'fake-token' })
      );

      const event = new Event('submit');
      component.handleSubmit(event);

      expect(authServiceSpy.signIn).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'Password123!',
      });

      tick(); // Simula el paso del tiempo para que se resuelva el observable

      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
      expect(component.isLoading).toBeFalse();
      expect(component.loginForm.value).toEqual({ email: null, password: null });
    }));

    it('debería mostrar una alerta si el login falla con un mensaje', fakeAsync(() => {
      spyOn(window, 'alert');
      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'Password123!',
      });
      authServiceSpy.signIn.and.returnValue(
        of({ message: 'Credenciales inválidas' })
      );

      const event = new Event('submit');
      component.handleSubmit(event);

      tick();

      expect(window.alert).toHaveBeenCalledWith('Credenciales inválidas');
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    }));
  });

  describe('Validación del formulario', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería ser inválido cuando está vacío', () => {
      expect(component.loginForm.valid).toBeFalse();
    });

    it('el campo de email debería ser inválido si no es un email correcto', () => {
      const email = component.loginForm.get('email');
      email?.setValue('test');
      expect(email?.valid).toBeFalse();
    });

    it('debería ser válido si todos los campos y validadores son correctos', () => {
      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'Password123!',
      });
      expect(component.loginForm.valid).toBeTrue();
    });
  });
});
