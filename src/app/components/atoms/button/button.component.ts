import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      class="btn"
      [class.btn-primary]="variant === 'primary'"
      [class.btn-secondary]="variant === 'secondary'"
      [disabled]="disabled"
      (click)="clickEvent.emit()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() disabled = false;
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Output() clickEvent = new EventEmitter<void>();
}
