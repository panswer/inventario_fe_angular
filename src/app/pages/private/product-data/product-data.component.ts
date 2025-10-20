import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { PriceService } from '../../../services/price.service';
import { Price } from '../../../models/price';
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

  isLoading = true;
  productForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(2)]),
    inStock: new FormControl(false, [Validators.required]),
  });
  priceForm = new FormGroup({
    amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    coin: new FormControl('', [Validators.required]),
  });
  coinList: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private priceService: PriceService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId') || "";
    this.loadProduct();
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
      .updateProductById({
        data: {
          inStock: inStock ?? this.product.inStock,
          name: name || this.product.name,
        },
        productId: this.productId,
      })
      .subscribe((result) => {
        if (result.product) {
          this.product = new Product(result.product);
        }

        if (result.message) {
          alert(result.message);
        }

        this.isLoading = false;
      });
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
}
