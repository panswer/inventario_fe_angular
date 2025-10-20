import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ButtonComponent } from './button.component';

// Componente de prueba para verificar ng-content
@Component({
  template: `<app-button>Haz clic aquí</app-button>`,
  standalone: true,
  imports: [ButtonComponent],
})
class TestHostComponent {}

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar el contenido proyectado usando ng-content', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    const buttonElement = hostFixture.nativeElement.querySelector('button');
    expect(buttonElement.textContent).toContain('Haz clic aquí');
  });

  it('debería emitir el evento clickEvent al hacer clic', () => {
    spyOn(component.clickEvent, 'emit');
    const buttonElement = nativeElement.querySelector('button');

    buttonElement?.click();

    expect(component.clickEvent.emit).toHaveBeenCalled();
  });

  it('debería estar deshabilitado cuando la propiedad disable es true', () => {
    component.disable = true;
    fixture.detectChanges();
    const buttonElement: HTMLButtonElement | null =
      nativeElement.querySelector('button');

    expect(buttonElement?.disabled).toBeTrue();
  });

  it('no debería emitir el evento clickEvent si está deshabilitado', () => {
    spyOn(component.clickEvent, 'emit');
    component.disable = true;
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement | null =
      nativeElement.querySelector('button');
    buttonElement?.click();

    expect(component.clickEvent.emit).not.toHaveBeenCalled();
  });

  it('debería tener las clases de estilo correctas por defecto', () => {
    const buttonElement = nativeElement.querySelector('button');
    const expectedClasses = [
      'rounded-md',
      'border-indigo-500',
      'bg-indigo-500',
      'text-white',
      'hover:bg-indigo-800',
      'hover:cursor-pointer',
      'disabled:cursor-not-allowed',
      'hover:disabled:bg-indigo-500',
      'p-1',
    ];

    expectedClasses.forEach((cssClass) => {
      expect(buttonElement?.classList.contains(cssClass))
        .withContext(`La clase ${cssClass} no fue encontrada`)
        .toBeTrue();
    });
  });
});
