import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() disable = false;
  @Output() clickEvent = new EventEmitter();

  handlerClickEvent(e: any) {
    e.preventDefault();

    this.clickEvent.emit();
  }
}
