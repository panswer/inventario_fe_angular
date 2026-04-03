import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { BarcodeScannerComponent } from '../../../components/molecules/barcode-scanner/barcode-scanner.component';
import { BillService } from '../../../services/bill.service';
import { CreateBillItemInput } from '../../../interfaces/services/bill-service';
import { StockService } from '../../../services/stock.service';
import { StockInterface } from '../../../interfaces/stock';
import { ProductService } from '../../../services/product.service';
import { ProductInterface } from '../../../interfaces/product';

interface SearchedProduct {
  product: ProductInterface;
  price: { _id: string; amount: number; coin: string };
}

@Component({
  selector: 'app-create-bill',
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent, BarcodeScannerComponent],
  templateUrl: './create-bill.component.html',
  styleUrl: './create-bill.component.css'
})
export class CreateBillComponent implements OnInit {
  allStocks: StockInterface[] = [];
  availableStocks: StockInterface[] = [];

  searchControl = new FormControl<string>('', []);
  searchedProduct: SearchedProduct | null = null;
  searchedProductCount = new FormControl<number>(1, [Validators.required, Validators.min(1)]);

  isScanning = false;

  controllersForm = {
    stock: new FormControl<string>('', [Validators.required]),
    count: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
  };

  mainFormGroup = new FormGroup(this.controllersForm);

  shoppingCar: FormGroup[] = [];

  constructor(
    private readonly billService: BillService,
    private readonly stockService: StockService,
    private readonly productService: ProductService,
    private readonly location: Location,
  ) { }

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks() {
    this.mainFormGroup.disable();
    this.searchControl.disable();
    this.stockService.getAllStocks({}).subscribe(result => {
      if (result.message) {
        alert(result.message);
      }

      this.allStocks = result.stocks;
      this.availableStocks = [...this.allStocks];
      this.mainFormGroup.enable();
      this.searchControl.enable();
    });
  }

  syncProductList() {
    const selectedStockIds = this.shoppingCar.map(item => item.value['stockId']);
    this.availableStocks = this.allStocks.filter(stock => !selectedStockIds.includes(stock._id));
  }

  searchByBarcode() {
    const barcode = this.searchControl.value?.trim();
    if (!barcode) {
      return;
    }

    this.productService.getProductByBarcode(barcode).subscribe(result => {
      if (result.message) {
        alert(result.message);
        this.clearSearch();
        return;
      }

      if (!result.product || !result.price) {
        alert('Producto no encontrado');
        this.clearSearch();
        return;
      }

      const stockWithProduct = this.allStocks.find(
        stock => stock.productId._id === result.product?._id
      );

      if (!stockWithProduct) {
        alert('El producto no tiene stock disponible');
        this.clearSearch();
        return;
      }

      this.searchedProduct = {
        product: result.product,
        price: result.price,
      };
    });
  }

  startScanner(): void {
    this.isScanning = true;
  }

  closeScannerModal(): void {
    this.isScanning = false;
  }

  onBarcodeScanned(barcode: string): void {
    this.searchControl.setValue(barcode);
    this.isScanning = false;
    this.searchByBarcode();
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.searchedProduct = null;
    this.searchedProductCount.setValue(1);
  }

  addSearchedProductToCart() {
    if (!this.searchedProduct) {
      return;
    }

    const stock = this.allStocks.find(
      s => s.productId._id === this.searchedProduct?.product._id
    );

    if (!stock) {
      alert('Producto no encontrado en stock');
      return;
    }

    const count = this.searchedProductCount.value;
    const countControl = new FormControl(count, [Validators.required, Validators.min(1)]);
    const shoppingItem = new FormGroup({
      count: countControl,
      stockId: new FormControl(stock._id, [Validators.required]),
    });

    this.shoppingCar.push(shoppingItem);
    this.clearSearch();
    this.syncProductList();
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

  getStockPrice(stockId: string): number {
    const stock = this.allStocks.find(s => s._id === stockId);
    return stock?.price?.amount ?? 0;
  }

  getItemSubtotal(stockId: string): number {
    const shopItem = this.shoppingCar.find(item => item.value['stockId'] === stockId);
    if (!shopItem) {
      return 0;
    }
    const count = shopItem.value['count'] ?? 0;
    const price = this.getStockPrice(stockId);
    return count * price;
  }

  get totalPrice(): number {
    return this.shoppingCar.reduce((total, shopItem) => {
      const stockId = shopItem.value['stockId'];
      return total + this.getItemSubtotal(stockId);
    }, 0);
  }

  handlerBack() {
    this.location.back();
  }
}
