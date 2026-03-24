import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { BillService } from '../../../services/bill.service';
import { CreateBillItemInput } from '../../../interfaces/services/bill-service';
import { StockService } from '../../../services/stock.service';
import { StockInterface } from '../../../interfaces/stock';

@Component({
  selector: 'app-create-bill',
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent],
  templateUrl: './create-bill.component.html',
  styleUrl: './create-bill.component.css'
})
export class CreateBillComponent implements OnInit {
  allStocks: StockInterface[] = [];
  availableStocks: StockInterface[] = [];

  controllersForm = {
    stock: new FormControl<string>('', [Validators.required]),
    count: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
  };

  mainFormGroup = new FormGroup(this.controllersForm);

  shoppingCar: FormGroup[] = [];

  constructor(
    private readonly billService: BillService,
    private readonly stockService: StockService,
    private readonly location: Location,
  ) { }

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks() {
    this.mainFormGroup.disable();
    this.stockService.getAllStocks({}).subscribe(result => {
      if (result.message) {
        alert(result.message);
      }

      this.allStocks = result.stocks;
      this.availableStocks = [...this.allStocks];
      this.mainFormGroup.enable();
    });
  }

  syncProductList() {
    const selectedStockIds = this.shoppingCar.map(item => item.value['stockId']);
    this.availableStocks = this.allStocks.filter(stock => !selectedStockIds.includes(stock._id));
  }

  handlerAddProduct() {
    const count = this.mainFormGroup.value['count'];
    const stockId = this.mainFormGroup.value['stock'];

    const countControl = new FormControl(count, [Validators.required, Validators.min(1)]);
    const shoppingItem = new FormGroup({
      count: countControl,
      stockId: new FormControl(stockId, [Validators.required]),
    });

    this.shoppingCar.push(shoppingItem);

    this.mainFormGroup.setValue({
      count: null,
      stock: '',
    });
    this.syncProductList();
  }

  deleteShoppingItem(shopItem: FormGroup) {
    const stockId = shopItem.value['stockId'];
    this.shoppingCar = this.shoppingCar.filter(item => item.value['stockId'] !== stockId);
    this.syncProductList();
  }

  handlerSubmitBill() {
    this.mainFormGroup.disable();
    this.mainFormGroup.setValue({
      count: null,
      stock: '',
    });

    const shoppingItems: CreateBillItemInput[] = this.shoppingCar.map(shopItem => {
      const stockId = shopItem.value['stockId'];
      const stock = this.allStocks.find(s => s._id === stockId);
      return {
        count: shopItem.value['count'],
        stockId: stockId,
        coin: stock?.price?.coin ?? 'USD',
      }
    });

    this.billService.createBill({ sellers: shoppingItems }).subscribe(res => {
      if (res.message) {
        alert("No se pudo guardar la orden");
      } else {
        alert("Se guardo la orden");
      }

      this.shoppingCar = [];
      this.syncProductList();
      this.mainFormGroup.enable();
    });
  }

  getStockProductName(stockId: string): string {
    const stock = this.allStocks.find(s => s._id === stockId);
    return stock?.productId?.name ?? '';
  }

  getStockCoin(stockId: string): string {
    const stock = this.allStocks.find(s => s._id === stockId);
    return stock?.price?.coin ?? '';
  }

  handlerBack() {
    this.location.back();
  }
}
