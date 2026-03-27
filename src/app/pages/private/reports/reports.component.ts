import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { ReportService } from '../../../services/report.service';
import { ProductService } from '../../../services/product.service';
import { WarehouseService } from '../../../services/warehouse.service';
import { ProductInterface } from '../../../interfaces/product';
import { WarehouseInterface } from '../../../interfaces/warehouse';
import { MovementType } from '../../../interfaces/services/report-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  activeTab: 'movements' | 'summary' | 'transfers' = 'movements';
  isLoading = false;
  products: ProductInterface[] = [];
  warehouses: WarehouseInterface[] = [];

  movementTypes: { value: MovementType | ''; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'initial', label: 'Inicial' },
    { value: 'in', label: 'Entrada' },
    { value: 'out', label: 'Salida' },
    { value: 'adjust', label: 'Ajuste' },
    { value: 'transfer', label: 'Transferencia' },
  ];

  reportForm = new FormGroup({
    productId: new FormControl(''),
    warehouseId: new FormControl(''),
    type: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  constructor(
    private reportService: ReportService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadWarehouses();
  }

  loadProducts(): void {
    this.productService.getAllProducts({ limit: 1000 }).subscribe((res) => {
      this.products = res.products;
    });
  }

  loadWarehouses(): void {
    this.warehouseService.getAllWarehouses({ limit: 1000 }).subscribe((res) => {
      this.warehouses = res.warehouses;
    });
  }

  setActiveTab(tab: 'movements' | 'summary' | 'transfers'): void {
    this.activeTab = tab;
  }

  getFormValues() {
    const values = this.reportForm.value;
    const params: Record<string, string> = {};

    if (values.productId) {
      params['productId'] = values.productId;
    }

    if (values.warehouseId) {
      params['warehouseId'] = values.warehouseId;
    }

    if (values.startDate) {
      params['startDate'] = values.startDate;
    }

    if (values.endDate) {
      params['endDate'] = values.endDate;
    }

    if (values.type && this.activeTab === 'movements') {
      params['type'] = values.type;
    }

    return params;
  }

  exportReport(): void {
    this.isLoading = true;
    const params = this.getFormValues();
    let filename = '';

    let observable;

    switch (this.activeTab) {
      case 'movements':
        observable = this.reportService.getMovements(params);
        filename = `reporte_movimientos_${this.getDateString()}.xlsx`;
        break;
      case 'summary':
        observable = this.reportService.getMovementsSummary(params);
        filename = `reporte_resumen_${this.getDateString()}.xlsx`;
        break;
      case 'transfers':
        observable = this.reportService.getTransfers(params);
        filename = `reporte_transferencias_${this.getDateString()}.xlsx`;
        break;
    }

    observable.subscribe({
      next: (blob) => {
        this.reportService.downloadBlob(blob, filename);
        this.isLoading = false;
      },
      error: () => {
        alert('No se pudo generar el reporte');
        this.isLoading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private getDateString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }
}
