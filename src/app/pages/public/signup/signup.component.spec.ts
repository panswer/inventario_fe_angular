import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SignupComponent } from './signup.component';
import { AuthService } from '../../../services/auth.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isValidToken',
      'signUp',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        SignupComponent, 
        ReactiveFormsModule, 
        RouterTestingModule.withRoutes([
          { path: 'signup', component: SignupComponent },
          { path: 'login', component: SignupComponent },
        ])
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería navegar a la página principal si el token ya es válido', () => {
      authServiceSpy.isValidToken.and.returnValue(true);
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });

    it('no debería navegar si el token no es válido', () => {
      authServiceSpy.isValidToken.and.returnValue(false);
      fixture.detectChanges();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('debería añadir los validadores de contraseña al formulario', () => {
      authServiceSpy.isValidToken.and.returnValue(false);
      fixture.detectChanges();
      const passwordControl = component.signupForm.get('password');
      passwordControl?.setValue('invalid');
      expect(component.signupForm.hasError('uppercase')).toBeTrue();
      expect(component.signupForm.hasError('num')).toBeTrue();
      expect(component.signupForm.hasError('specialChar')).toBeTrue();
    });
  });

  describe('handleSubmit', () => {
    beforeEach(() => {
      authServiceSpy.isValidToken.and.returnValue(false);
      fixture.detectChanges();
    });

    it('no debería llamar a signUp si el formulario es inválido', () => {
      const event = new Event('submit');
      component.handleSubmit(event);
      expect(authServiceSpy.signUp).not.toHaveBeenCalled();
    });

    it('debería llamar a signUp y navegar a login en un signup exitoso', fakeAsync(() => {
      component.signupForm.setValue({
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      authServiceSpy.signUp.and.returnValue(of({}));

      const event = new Event('submit');
      component.handleSubmit(event);

      expect(authServiceSpy.signUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'Password123!',
      });

      tick();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.isLoading).toBeFalse();
    }));

    it('debería mostrar una alerta si el signup falla con un mensaje', fakeAsync(() => {
      spyOn(window, 'alert');
      component.signupForm.setValue({
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      authServiceSpy.signUp.and.returnValue(
        of({ message: 'El usuario ya está registrado' })
      );

      const event = new Event('submit');
      component.handleSubmit(event);

      tick();

      expect(window.alert).toHaveBeenCalledWith('El usuario ya está registrado');
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    }));
  });

  describe('Validación del formulario', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería ser inválido cuando está vacío', () => {
      expect(component.signupForm.valid).toBeFalse();
    });

    it('el campo de email debería ser inválido si no es un email correcto', () => {
      const email = component.signupForm.get('email');
      email?.setValue('test');
      expect(email?.valid).toBeFalse();
    });

    it('debería ser válido si todos los campos y validadores son correctos', () => {
      component.signupForm.setValue({
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      expect(component.signupForm.valid).toBeTrue();
    });
  });
});
