import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { PriceService } from '../../../services/price.service';
import { Price } from '../../../models/price';
import { StockService } from '../../../services/stock.service';
import { StockInterface } from '../../../interfaces/stock';
import { map } from 'rxjs';
import { Location } from '@angular/common';
import { ButtonComponent } from '../../../components/atoms/button/button.component';

@Component({
  selector: 'app-product-data',
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './product-data.component.html',
  styleUrl: './product-data.component.css'
})
export class ProductDataComponent implements OnInit {
  private productId = "";
  private product: Product | undefined;
  private price: Price | undefined;
  stock: StockInterface | undefined;

  isLoading = true;
  isUpdatingStock = false;
  productForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(2)]),
    inStock: new FormControl(false, [Validators.required]),
  });
  priceForm = new FormGroup({
    amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    coin: new FormControl('', [Validators.required]),
  });
  coinList: string[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  minQuantityForm = new FormGroup({
    minQuantity: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
  });
  stockAmountForm = new FormGroup({
    amount: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private priceService: PriceService,
    private stockService: StockService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId') || "";
    this.loadProduct();
    this.loadStock();
  }

  loadStock(): void {
    this.stockService.getStockByProductId({ productId: this.productId }).subscribe((res) => {
      if (res.stock) {
        this.stock = res.stock;
        this.minQuantityForm.setValue({ minQuantity: res.stock.minQuantity });
      }
    });
  }

  loadProduct() {
    this
      .productService
      .getProductById(this.productId)
      .subscribe((result) => {
        if (result.product) {
          this.product = new Product(result.product);
          this.productForm.setValue({
            name: this.product.name,
            inStock: this.product.inStock,
          });
          this.loadPrice();
        }

        if (result.message) {
          alert(result.message);
        }
      });
  }

  loadPrice() {
    this
      .priceService
      .getPriceByProductId(this.productId)
      .pipe(map((data) => {
        this.loadCoin();

        return data;
      }))
      .subscribe((result) => {
        if (result.price) {
          this.price = new Price(result.price);
          this.priceForm.setValue({
            amount: this.price.amount,
            coin: this.price.coin,
          });
          this.isLoading = false;
        }

        if (result.message) {
          alert(result.message);
        }
      });
  }

  loadCoin() {
    this
      .priceService
      .getAllCoins()
      .subscribe((result) => {
        this.coinList = result;
      });
  }

  goBack() {
    this.location.back();
  }

  handlerSubmitProduct() {
    if (this.productForm.status !== 'VALID' || !this.product) {
      return;
    }

    this.isLoading = true;
    const { inStock, name } = this.productForm.value;

    this
      .productService
      .updateProductById(
        {
          data: {
            inStock: inStock ?? this.product.inStock,
            name: name || this.product.name,
          },
          productId: this.productId,
        },
        this.selectedImage ?? undefined
      )
      .subscribe((result) => {
        if (result.product) {
          this.product = new Product(result.product);
          this.selectedImage = null;
        }

        if (result.message) {
          alert(result.message);
        }

        this.isLoading = false;
      });
  }

  handlerFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/svg+xml'];
      const maxSize = 2 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        alert('Tipo de archivo no válido. Solo se permiten JPG, JPEG y SVG.');
        input.value = '';
        return;
      }

      if (file.size > maxSize) {
        alert('El archivo excede el límite de 2MB.');
        input.value = '';
        return;
      }

      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  handlerSubmitPrice() {
    if (this.priceForm.status !== 'VALID' || this.isLoading || !this.price) {
      return;
    }

    this.isLoading = true;

    const { amount, coin } = this.priceForm.value;
    this
      .priceService
      .updatePriceById({
        data: {
          amount: amount ?? this.price.amount,
        },
        priceId: this.price._id,
        coin: coin || this.price.coin,
      })
      .subscribe(result => {
        if (result.price) {
          this.price = new Price(result.price);
        }

        if (result.message) {
          alert(result.message);
        }

        this.isLoading = false;
      })
  }

  handlerUpdateMinQuantity(): void {
    if (this.minQuantityForm.status !== 'VALID' || !this.stock) {
      return;
    }

    this.isUpdatingStock = true;
    const minQuantity = this.minQuantityForm.value.minQuantity ?? this.stock.minQuantity;

    this.stockService.updateStockMinQuantity({
      stockId: this.stock._id,
      minQuantity,
    }).subscribe((res) => {
      if (res.stock) {
        this.stock = res.stock;
        alert('Cantidad mínima actualizada');
      }

      if (res.message) {
        alert(res.message);
      }

      this.isUpdatingStock = false;
    });
  }

  handlerAddStock(): void {
    if (this.stockAmountForm.status !== 'VALID' || !this.stock) {
      return;
    }

    this.isUpdatingStock = true;
    const amount = this.stockAmountForm.value.amount ?? 1;

    this.stockService.addStockAmount({
      stockId: this.stock._id,
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

      this.isUpdatingStock = false;
    });
  }

  handlerRemoveStock(): void {
    if (this.stockAmountForm.status !== 'VALID' || !this.stock) {
      return;
    }

    this.isUpdatingStock = true;
    const amount = this.stockAmountForm.value.amount ?? 1;

    this.stockService.removeStockAmount({
      stockId: this.stock._id,
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

      this.isUpdatingStock = false;
    });
  }
}
