import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-paginator',
  imports: [FontAwesomeModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
})
export class PaginatorComponent {
  @Input({ required: true }) set total(value: number) {
    this._total.set(value);
  }
  @Input() set limit(value: number) {
    this._limit.set(value);
  }
  @Input() set page(value: number) {
    this._page.set(value);
  }

  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  protected readonly _total = signal(0);
  protected readonly _limit = signal(10);
  protected readonly _page = signal(1);
  protected readonly limitOptions = [10, 25, 50, 100];

  protected readonly totalPages = computed(() => Math.ceil(this._total() / this._limit()) || 1);

  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;

  onLimitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newLimit = Number(select.value);
    this._limit.set(newLimit);
    this._page.set(1);
    this.limitChange.emit(newLimit);
    this.pageChange.emit(1);
  }

  handleChangePage(delta: number): void {
    const newPage = this._page() + delta;
    if (newPage < 1 || newPage > this.totalPages()) {
      return;
    }
    this._page.set(newPage);
    this.pageChange.emit(newPage);
  }
}
