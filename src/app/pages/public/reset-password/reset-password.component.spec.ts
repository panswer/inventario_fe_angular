import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../../services/auth.service';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['resetPassword', 'resetPasswordVerify']);

    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent, 
        ReactiveFormsModule, 
        RouterTestingModule.withRoutes([
          { path: 'login', component: ResetPasswordComponent }
        ])
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initial state', () => {
    it('debería estar en el paso 1 inicialmente', () => {
      fixture.detectChanges();
      expect(component.currentStep).toBe(1);
    });

    it('debería tener el formulario de email creado', () => {
      fixture.detectChanges();
      expect(component.emailForm).toBeTruthy();
    });

    it('debería tener el formulario de verificación creado', () => {
      fixture.detectChanges();
      expect(component.verifyForm).toBeTruthy();
    });
  });

  describe('Step 1 - Email Form', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('no debería llamar a resetPassword si el formulario es inválido', () => {
      const event = new Event('submit');
      component.handleEmailSubmit(event);
      expect(authServiceSpy.resetPassword).not.toHaveBeenCalled();
    });

    it('debería validar que el email sea requerido', () => {
      const emailControl = component.emailForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.valid).toBeFalse();
    });

    it('debería validar el formato del email', () => {
      const emailControl = component.emailForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalse();
    });

    it('debería ser válido con un email correcto', () => {
      const emailControl = component.emailForm.get('email');
      emailControl?.setValue('test@test.com');
      expect(emailControl?.valid).toBeTrue();
    });

    it('debería llamar a resetPassword con el email', fakeAsync(() => {
      component.emailForm.setValue({ email: 'test@test.com' });
      authServiceSpy.resetPassword.and.returnValue(of({ message: '' }));

      const event = new Event('submit');
      component.handleEmailSubmit(event);

      expect(authServiceSpy.resetPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
      });
      tick();
    }));

    it('debería mostrar error si resetPassword falla', fakeAsync(() => {
      component.emailForm.setValue({ email: 'test@test.com' });
      authServiceSpy.resetPassword.and.returnValue(
        of({ message: 'No se pudo enviar el correo de recuperación' })
      );

      const event = new Event('submit');
      component.handleEmailSubmit(event);
      tick();

      expect(component.message).toBe('No se pudo enviar el correo de recuperación');
      expect(component.isSuccess).toBeFalse();
      expect(component.currentStep).toBe(1);
    }));

    it('debería ir al paso 2 si resetPassword es exitoso', fakeAsync(() => {
      component.emailForm.setValue({ email: 'test@test.com' });
      authServiceSpy.resetPassword.and.returnValue(of({ message: '' }));

      const event = new Event('submit');
      component.handleEmailSubmit(event);
      tick();

      expect(component.currentStep).toBe(2);
      expect(component.email).toBe('test@test.com');
    }));

    it('debería deshabilitar el botón mientras está cargando', fakeAsync(() => {
      component.emailForm.setValue({ email: 'test@test.com' });
      authServiceSpy.resetPassword.and.returnValue(of({ message: '' }));

      const event = new Event('submit');
      component.handleEmailSubmit(event);

      tick();

      expect(component.isLoading).toBeFalse();
    }));
  });

  describe('Step 2 - Token/Password Form', () => {
    beforeEach(() => {
      component.currentStep = 2;
      component.email = 'test@test.com';
      fixture.detectChanges();
    });

    it('no debería llamar a resetPasswordVerify si el formulario es inválido', () => {
      const event = new Event('submit');
      component.handleVerifySubmit(event);
      expect(authServiceSpy.resetPasswordVerify).not.toHaveBeenCalled();
    });

    it('debería validar que el token sea requerido', () => {
      const tokenControl = component.verifyForm.get('token');
      tokenControl?.setValue('');
      expect(tokenControl?.valid).toBeFalse();
    });

    it('debería validar que el token tenga exactamente 6 caracteres', () => {
      const tokenControl = component.verifyForm.get('token');
      tokenControl?.setValue('12345');
      expect(tokenControl?.valid).toBeFalse();

      tokenControl?.setValue('1234567');
      expect(tokenControl?.valid).toBeFalse();

      tokenControl?.setValue('123456');
      expect(tokenControl?.valid).toBeTrue();
    });

    it('debería validar que la contraseña sea requerida', () => {
      const passwordControl = component.verifyForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.valid).toBeFalse();
    });

    it('debería validar la contraseña con todos los requisitos', () => {
      const passwordControl = component.verifyForm.get('password');
      
      passwordControl?.setValue('short');
      expect(passwordControl?.valid).toBeFalse();

      passwordControl?.setValue('password');
      expect(component.verifyForm.hasError('uppercase')).toBeTrue();
      expect(component.verifyForm.hasError('num')).toBeTrue();
      expect(component.verifyForm.hasError('specialChar')).toBeTrue();

      passwordControl?.setValue('Password1');
      expect(component.verifyForm.hasError('specialChar')).toBeTrue();

      passwordControl?.setValue('Password1!');
      expect(passwordControl?.valid).toBeTrue();
    });

    it('debería llamar a resetPasswordVerify con los datos correctos', fakeAsync(() => {
      component.verifyForm.setValue({
        token: '123456',
        password: 'Password123!',
      });
      authServiceSpy.resetPasswordVerify.and.returnValue(of({ message: undefined }));

      const event = new Event('submit');
      component.handleVerifySubmit(event);

      tick();
      fixture.detectChanges();

      expect(authServiceSpy.resetPasswordVerify).toHaveBeenCalledWith({
        email: 'test@test.com',
        token: '123456',
        password: 'Password123!',
      });
    }));

    it('debería mostrar error 1003 cuando el token es inválido', fakeAsync(() => {
      component.verifyForm.setValue({
        token: '123456',
        password: 'Password123!',
      });
      authServiceSpy.resetPasswordVerify.and.returnValue(
        of({ code: 1003, message: 'Token o correo inválido' })
      );

      const event = new Event('submit');
      component.handleVerifySubmit(event);
      tick();

      expect(component.message).toBe('Token o correo inválido');
      expect(component.isSuccess).toBeFalse();
    }));

    it('debería mostrar error 1004 cuando hay error del servidor', fakeAsync(() => {
      component.verifyForm.setValue({
        token: '123456',
        password: 'Password123!',
      });
      authServiceSpy.resetPasswordVerify.and.returnValue(
        of({ code: 1004, message: 'Error del servidor' })
      );

      const event = new Event('submit');
      component.handleVerifySubmit(event);
      tick();

      expect(component.message).toBe('Error del servidor');
      expect(component.isSuccess).toBeFalse();
    }));

    it('debería mostrar mensaje de éxito en caso exitoso', fakeAsync(() => {
      component.verifyForm.setValue({
        token: '123456',
        password: 'Password123!',
      });
      authServiceSpy.resetPasswordVerify.and.returnValue(of({ message: undefined }));

      const event = new Event('submit');
      component.handleVerifySubmit(event);
      tick();

      expect(component.message).toBe('Contraseña actualizada correctamente');
      expect(component.isSuccess).toBeTrue();
    }));
  });
});
