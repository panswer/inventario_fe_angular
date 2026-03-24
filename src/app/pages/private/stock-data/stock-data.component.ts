import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { StockService } from '../../../services/stock.service';
import { StockInterface } from '../../../interfaces/stock';

@Component({
  selector: 'app-stock-data',
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './stock-data.component.html',
  styleUrl: './stock-data.component.css'
})
export class StockDataComponent implements OnInit {
  private stockId = '';
  stock: StockInterface | undefined;
  isLoading = true;
  isUpdating = false;

  minQuantityForm = new FormGroup({
    minQuantity: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
  });

  stockAmountForm = new FormGroup({
    amount: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private stockService: StockService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.stockId = this.activatedRoute.snapshot.paramMap.get('stockId') || '';
    this.loadStock();
  }

  loadStock(): void {
    this.isLoading = true;
    this.stockService.getStockById({ stockId: this.stockId }).subscribe((res) => {
      if (res.stock) {
        this.stock = res.stock;
        this.minQuantityForm.setValue({ minQuantity: res.stock.minQuantity });
      }

      if (res.message) {
        alert(res.message);
      }

      this.isLoading = false;
    });
  }

  handlerUpdateMinQuantity(): void {
    if (this.minQuantityForm.status !== 'VALID' || !this.stock) {
      return;
    }

    this.isUpdating = true;
    const minQuantity = this.minQuantityForm.value.minQuantity ?? this.stock.minQuantity;

    this.stockService.updateStockMinQuantity({
      stockId: this.stockId,
      minQuantity,
    }).subscribe((res) => {
      if (res.stock) {
        this.stock = res.stock;
        alert('Cantidad mínima actualizada');
      }

      if (res.message) {
        alert(res.message);
      }

      this.isUpdating = false;
    });
  }

  handlerAddStock(): void {
    if (this.stockAmountForm.status !== 'VALID' || !this.stock) {
      return;
    }

    this.isUpdating = true;
    const amount = this.stockAmountForm.value.amount ?? 1;

    this.stockService.addStockAmount({
      stockId: this.stockId,
      amount,
    }).subscribe((res) => {
      if (res.stock) {
        this.stock = res.stock;
        this.stockAmountForm.setValue({ amount: 1 });
        alert('Stock agregado');
      }

      if (res.message) {
        alert(res.message);
      }

      this.isUpdating = false;
    });
  }

  handlerRemoveStock(): void {
    if (this.stockAmountForm.status !== 'VALID' || !this.stock) {
      return;
    }

    this.isUpdating = true;
    const amount = this.stockAmountForm.value.amount ?? 1;

    this.stockService.removeStockAmount({
      stockId: this.stockId,
      amount,
    }).subscribe((res) => {
      if (res.stock) {
        this.stock = res.stock;
        this.stockAmountForm.setValue({ amount: 1 });
        alert('Stock quitado');
      }

      if (res.message) {
        alert(res.message);
      }

      this.isUpdating = false;
    });
  }

  goBack(): void {
    this.location.back();
  }
}
