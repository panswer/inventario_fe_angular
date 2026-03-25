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
  selectedImage: File | null = null;
  imagePreview: string | null = null;

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
    if (this.productForm.invalid) {
      return;
    }

    this.isLoading = true;

    const { amount, coin, name } = this.productForm.value as CreateProduct;
    this.productService
      .createProduct(
        {
          amount,
          coin,
          name,
        },
        this.selectedImage ?? undefined
      )
      .subscribe((result) => {
        if (result.message) {
          alert(result.message);
        } else {
          this.productForm.reset({ name: '', amount: 0, coin: '' });
          this.selectedImage = null;
          this.imagePreview = null;
          alert('Se creo el producto');
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

  goBack() {
    this.router.navigate(['']);
  }
}
