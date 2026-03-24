import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
} from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { TableHeadCol } from '../../../interfaces/components/table';
import { TableBodyCellDirective } from '../../../directives/table-body-cell.directive';
import { PaginatorComponent } from '../../atoms/paginator/paginator.component';

@Component({
  selector: 'app-table',
  imports: [NgFor, NgIf, NgTemplateOutlet, PaginatorComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input({ required: true }) cols: TableHeadCol[] = [];
  @Input({}) rows: Record<string, any>[] | null = [];
  @Input({ required: true }) total: number = 1;

  @ContentChild(TableBodyCellDirective, { read: TemplateRef })
  tableBodyCellTemplate?: TemplateRef<any>;

  getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current: any, key: string) => {
      if (current && typeof current === 'object') {
        return (current as Record<string, any>)[key];
      }
      return current[key];
    }, obj);
  }
}
