import { Component, OnInit, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { ProductService } from '../../../services/product.service';
import { CreateProduct } from '../../../interfaces/create-product';
import { Router } from '@angular/router';
import { PriceService } from '../../../services/price.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { BarcodeScannerComponent } from '../../../components/molecules/barcode-scanner/barcode-scanner.component';

@Component({
  selector: 'app-create-product',
  imports: [ReactiveFormsModule, ButtonComponent, BarcodeScannerComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private priceService = inject(PriceService);
  private categoryService = inject(CategoryService);

  isLoading = signal(true);
  coinList: string[] = [];
  categoryList: Category[] = [];
  selectedCategories: string[] = [];
  selectedImage: File | null = null;
  imagePreview = signal<string | null>(null);
  isScanningBarcode = false;

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    coin: new FormControl('', [Validators.required]),
    barcode: new FormControl('', []),
  });

  ngOnInit(): void {
    this.priceService.getAllCoins().subscribe((coins) => {
      this.coinList = coins;
      if (coins.length > 0) {
        this.isLoading.set(false);
      }
    });

    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categoryList = categories;
    });
  }

  handlerSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    const { amount, coin, name, barcode } = this.productForm.value as CreateProduct;
    this.productService
      .createProduct(
        {
          amount,
          coin,
          name,
          barcode: barcode || undefined,
          categories: this.selectedCategories.length > 0 ? this.selectedCategories : undefined,
        },
        this.selectedImage ?? undefined
      )
      .subscribe((result) => {
        if (result.message) {
          alert(result.message);
        } else {
          this.productForm.reset({ name: '', amount: 0, coin: '', barcode: '' });
          this.selectedImage = null;
          this.imagePreview.set(null);
          this.selectedCategories = [];
          alert('Se creo el producto');
        }

        this.isLoading.set(false);
      });
  }

  toggleCategory(categoryId: string): void {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryId);
    }
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  startBarcodeScanner(): void {
    this.isScanningBarcode = true;
  }

  onBarcodeScanned(barcode: string): void {
    this.productForm.patchValue({ barcode });
    this.isScanningBarcode = false;
    alert(`Código de barras escaneado: ${barcode}`);
  }

  closeBarcodeScanner(): void {
    this.isScanningBarcode = false;
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
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  goBack(): void {
    this.router.navigate(['']);
  }
}
