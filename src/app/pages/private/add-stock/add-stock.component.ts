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

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, FormsModule],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.css',
})
export class AddStockComponent implements OnInit {
  stockForm: FormGroup;
  products: ProductInterface[] = [];
  warehouses: WarehouseInterface[] = [];
  currentStock: number = 0;
  existingStockId: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private router: Router
  ) {
    this.stockForm = this.fb.group({
      productId: ['', Validators.required],
      warehouseId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      minQuantity: ['', Validators.min(0)],
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
    this.resetWarehouseSelection();
  }

  onWarehouseChange(): void {
    const productId = this.stockForm.get('productId')?.value;
    const warehouseId = this.stockForm.get('warehouseId')?.value;

    if (productId && warehouseId) {
      this.stockService.getStocksByProduct(productId).subscribe((res) => {
        const stock = res.stocks.find(
          (s) => (s.warehouseId as unknown as WarehouseInterface)?._id === warehouseId
        );

        if (stock) {
          this.currentStock = stock.quantity;
          this.existingStockId = stock._id;
        } else {
          this.currentStock = 0;
          this.existingStockId = null;
        }
      });
    }
  }

  resetWarehouseSelection(): void {
    this.stockForm.get('warehouseId')?.setValue('');
    this.currentStock = 0;
    this.existingStockId = null;
  }

  onSubmit(): void {
    if (this.stockForm.invalid) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.isLoading = true;
    const { productId, warehouseId, quantity, minQuantity } = this.stockForm.value;

    if (this.existingStockId) {
      this.stockService
        .addStockAmount({
          stockId: this.existingStockId,
          amount: quantity,
        })
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res.message) {
              alert(res.message);
            } else {
              alert('Stock agregado exitosamente');
              this.stockForm.reset();
              this.currentStock = 0;
              this.existingStockId = null;
            }
          },
          error: () => {
            this.isLoading = false;
            alert('Error al agregar stock');
          },
        });
    } else {
      this.stockService
        .createStock({
          productId,
          warehouseId,
          quantity,
          minQuantity: minQuantity || 0,
        })
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res.message) {
              alert(res.message);
            } else {
              alert('Stock creado exitosamente');
              this.stockForm.reset();
              this.currentStock = 0;
              this.existingStockId = null;
            }
          },
          error: () => {
            this.isLoading = false;
            alert('Error al crear stock');
          },
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/stock']);
  }
}