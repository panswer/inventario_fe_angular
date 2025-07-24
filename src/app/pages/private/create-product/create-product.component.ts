import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { NgFor } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { CreateProduct } from '../../../interfaces/create-product';
import { Router } from '@angular/router';
import { PriceService } from '../../../services/price.service';

@Component({
  selector: 'app-create-product',
  imports: [ReactiveFormsModule, ButtonComponent, NgFor],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent implements OnInit {
  isLoading = true;
  coinList: string[] = [];

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    coin: new FormControl('', [Validators.required]),
  });

  constructor(
    private productService: ProductService,
    private router: Router,
    private priceService: PriceService
  ) {}

  ngOnInit(): void {
    this.priceService.getAllCoins().subscribe((coins) => {
      this.coinList = coins;
      if (coins.length > 0) {
        this.isLoading = false;
      }
    });
  }

  handlerPreventEvent(e: any) {
    e.preventDefault();
  }

  handlerSubmit() {
    this.isLoading = true;

    const { amount, coin, name } = this.productForm.value as CreateProduct;
    this.productService
      .createProduct({
        amount,
        coin,
        name,
      })
      .subscribe((result) => {
        if (result.message) {
          alert(result.message);
        }

        if (result.price && result.product) {
          this.productForm.setValue({
            name: '',
            amount: 0,
            coin: '',
          });
          alert('Se creo el producto');
        }

        this.isLoading = false;
      });
  }

  goBack() {
    this.router.navigate(['']);
  }
}
