import { Component, OnInit } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault, DatePipe } from '@angular/common';
import { TableComponent } from '../../../components/molecules/table/table.component';
import { TableHeadCol } from '../../../interfaces/components/table';
import { WarehouseService } from '../../../services/warehouse.service';
import { WarehouseInterface } from '../../../interfaces/services/warehouse-service';
import { TableBodyCellDirective } from '../../../directives/table-body-cell.directive';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [
    TableComponent,
    NgSwitch,
    NgSwitchDefault,
    NgSwitchCase,
    TableBodyCellDirective,
    ButtonComponent,
    FontAwesomeModule,
    DatePipe,
  ],
  templateUrl: './warehouses.component.html',
  styleUrl: './warehouses.component.css',
})
export class WarehousesComponent implements OnInit {
  tableField: TableHeadCol[] = [
    {
      field: 'name',
      text: 'nombre',
    },
    {
      field: 'address',
      text: 'dirección',
    },
    {
      field: 'isEnabled',
      text: 'estado',
    },
    {
      field: 'createdAt',
      text: 'fecha crea.',
    },
    {
      field: 'actions',
      text: 'acciones',
    },
  ];

  warehouses: WarehouseInterface[] = [];
  warehouseTotal: number = 0;
  pageData = {
    page: 1,
    limit: 10,
  };

  editIcon = faEdit;
  deleteIcon = faTrashAlt;

  constructor(private warehouseService: WarehouseService, private router: Router) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.warehouseService.getAllWarehouses(this.pageData).subscribe((res) => {
      this.warehouses = res.warehouses;
      this.warehouseTotal = res.total;

      if (res.message) {
        alert(res.message);
      }
    });
  }

  goToProducts(): void {
    this.router.navigate(['/']);
  }

  goToStocks(): void {
    this.router.navigate(['/stock']);
  }

  goToSellers(): void {
    this.router.navigate(['/seller']);
  }

  goToReports(): void {
    this.router.navigate(['/report']);
  }

  goToUsers(): void {
    this.router.navigate(['/users']);
  }

  goToWarehouseForm(): void {
    this.router.navigate(['/warehouses/new']);
  }

  goToWarehouseDetail(warehouseId: string): void {
    this.router.navigate(['/warehouses', warehouseId]);
  }

  deleteWarehouse(warehouseId: string): void {
    if (confirm('¿Está seguro de que desea eliminar este almacén?')) {
      this.warehouseService.deleteWarehouse(warehouseId).subscribe((res) => {
        if (res.message) {
          alert(res.message);
        } else {
          this.loadWarehouses();
        }
      });
    }
  }
}