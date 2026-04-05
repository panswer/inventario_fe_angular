import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StockService } from '../../../services/stock.service';
import { ProductService } from '../../../services/product.service';
import { WarehouseService } from '../../../services/warehouse.service';
import { ProductInterface } from '../../../interfaces/product';
import { WarehouseInterface } from '../../../interfaces/services/warehouse-service';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { FormsModule } from '@angular/forms';

interface StockByWarehouse {
  warehouseId: string;
  warehouseName: string;
  quantity: number;
}

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, FormsModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css',
})
export class TransferComponent implements OnInit {
  transferForm: FormGroup;
  products: ProductInterface[] = [];
  warehouses: WarehouseInterface[] = [];
  stocksByProduct: StockByWarehouse[] = [];
  availableStock: number = 0;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private router: Router
  ) {
    this.transferForm = this.fb.group({
      productId: ['', Validators.required],
      fromWarehouseId: ['', Validators.required],
      toWarehouseId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

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
      this.warehouses = res.warehouses.filter((w) => w.isEnabled);
    });
  }

  onProductChange(): void {
    const productId = this.transferForm.get('productId')?.value;
    if (productId) {
      this.stockService.getStocksByProduct(productId).subscribe((res) => {
        if (res.stocks && res.stocks.length > 0) {
          this.stocksByProduct = res.stocks
            .filter((stock) => stock.warehouseId)
            .map((stock) => ({
              warehouseId: (stock.warehouseId as unknown as WarehouseInterface)._id,
              warehouseName: (stock.warehouseId as unknown as WarehouseInterface).name,
              quantity: stock.quantity,
            }));
        } else {
          this.stocksByProduct = [];
        }
        this.availableStock = 0;
        this.transferForm.get('fromWarehouseId')?.setValue('');
        this.transferForm.get('toWarehouseId')?.setValue('');
      });
    }
  }

  onSourceWarehouseChange(): void {
    const fromWarehouseId = this.transferForm.get('fromWarehouseId')?.value;
    const stock = this.stocksByProduct.find(
      (s) => s.warehouseId === fromWarehouseId
    );
    this.availableStock = stock ? stock.quantity : 0;

    this.sortWarehousesForDestination(fromWarehouseId);
  }

  sortWarehousesForDestination(sourceWarehouseId: string): void {
    const sourceWarehouse = this.warehouses.find(w => w._id === sourceWarehouseId);
    if (sourceWarehouse) {
      this.warehouses = [
        sourceWarehouse,
        ...this.warehouses.filter(w => w._id !== sourceWarehouseId)
      ];
    }
  }

  onSubmit(): void {
    if (this.transferForm.invalid) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const { productId, fromWarehouseId, toWarehouseId, quantity } =
      this.transferForm.value;

    if (fromWarehouseId === toWarehouseId) {
      alert('El almacén de origen y destino no pueden ser iguales');
      return;
    }

    if (quantity > this.availableStock) {
      alert('La cantidad no puede exceder el stock disponible');
      return;
    }

    this.isLoading = true;
    this.stockService
      .transferStock({
        productId,
        fromWarehouseId,
        toWarehouseId,
        quantity,
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.message) {
            alert(res.message);
          } else {
            alert('Transferencia realizada exitosamente');
            this.transferForm.reset();
            this.stocksByProduct = [];
            this.availableStock = 0;
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Error al realizar la transferencia');
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/stock']);
  }
}