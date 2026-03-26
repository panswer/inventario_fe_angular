import { Component, OnInit } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { TableComponent } from '../../../components/molecules/table/table.component';
import { TableHeadCol } from '../../../interfaces/components/table';
import { StockService } from '../../../services/stock.service';
import { StockInterface } from '../../../interfaces/stock';
import { TableBodyCellDirective } from '../../../directives/table-body-cell.directive';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stocks',
  imports: [
    TableComponent,
    NgSwitch,
    NgSwitchDefault,
    NgSwitchCase,
    TableBodyCellDirective,
    ButtonComponent,
  ],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css',
})
export class StocksComponent implements OnInit {
  tableField: TableHeadCol[] = [
    {
      field: 'productId.name',
      text: 'producto',
    },
    {
      field: 'warehouseId.name',
      text: 'almacén',
    },
    {
      field: 'quantity',
      text: 'cantidad',
    },
    {
      field: 'minQuantity',
      text: 'cant. mín.',
    },
    {
      field: 'actions',
      text: 'acciones',
    },
  ];

  stocks: StockInterface[] = [];
  stockTotal: number = 0;
  pageData = {
    page: 1,
    limit: 10,
  };

  constructor(private stockService: StockService, private router: Router) { }

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.stockService.getAllStocks(this.pageData).subscribe((res) => {
      this.stocks = res.stocks;
      this.stockTotal = res.total;

      if (res.message) {
        alert(res.message);
      }
    });
  }

  goToProducts(): void {
    this.router.navigate(['/']);
  }

  goToSellers(): void {
    this.router.navigate(['/seller']);
  }

  goToTransfer(): void {
    this.router.navigate(['/transfer']);
  }

  goToAddStock(): void {
    this.router.navigate(['/stock/add']);
  }

  goToStockDetail(stockId: string): void {
    this.router.navigate(['/stock', stockId]);
  }

  getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((current: any, key: string) => {
      if (current && typeof current === 'object') {
        return (current as Record<string, unknown>)[key];
      }
      return current[key];
    }, obj);
  }
}
