import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TableHeadCol } from '../../../interfaces/components/table';
import { TableBodyCellDirective } from '../../../directives/table-body-cell.directive';
import { PaginatorComponent } from '../../atoms/paginator/paginator.component';

@Component({
  selector: 'app-table',
  imports: [NgTemplateOutlet, PaginatorComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent<T> {
  @Input({ required: true }) cols: TableHeadCol[] = [];
  @Input() rows: T[] | null = [];
  @Input({ required: true }) total: number = 1;
  @Input() page: number = 1;
  @Input() limit: number = 10;

  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  @ContentChild(TableBodyCellDirective, { read: TemplateRef })
  tableBodyCellTemplate?: TemplateRef<unknown>;

  getNestedValue(obj: T, path: string): unknown {
    const keys = path.split('.');
    let current: unknown = obj;
    for (const key of keys) {
      if (current && typeof current === 'object') {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }
    return current;
  }
}
