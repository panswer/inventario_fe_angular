import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  private defaultDuration = 4000;

  getToasts(): Observable<Toast[]> {
    return this.toasts$.asObservable();
  }

  private show(message: string, type: ToastType, duration?: number): void {
    const id = crypto.randomUUID();
    const toast: Toast = {
      id,
      message,
      type,
      duration: duration ?? this.defaultDuration
    };

    this.toasts$.next([...this.toasts$.value, toast]);

    setTimeout(() => {
      this.remove(id);
    }, toast.duration);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  remove(id: string): void {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts$.next([]);
  }
}