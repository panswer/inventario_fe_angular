import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="toast-container">
      @for (toast of toasts$ | async; track toast.id) {
        <app-toast 
          [toast]="toast" 
          (onClose)="toastService.remove(toast.id)"
        ></app-toast>
      }
    </div>
  `,
  styleUrl: './toast-container.component.css'
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
  toasts$ = this.toastService.getToasts();
}