import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { CommonModule, Location } from '@angular/common';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { PriceService } from '../../../services/price.service';
import { SellerItem } from '../../../interfaces/seller-item';
import { BillService } from '../../../services/bill.service';
import { CreateBillItemInput } from '../../../interfaces/services/bill-service';

@Component({
  selector: 'app-create-bill',
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent],
  templateUrl: './create-bill.component.html',
  styleUrl: './create-bill.component.css'
})
export class CreateBillComponent implements OnInit {
  allProducts: Product[] = [];
  products: Product[] = [];
  sellers: SellerItem[] = [];

  controllersForm = {
    product: new FormControl<string>('', [Validators.required]),
    count: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
    subTotal: new FormControl<number>(0),
  };

  mainFormGroup = new FormGroup(this.controllersForm);

  shoppingCar: FormGroup[] = [];

  total = 0;

  constructor(
    private readonly productService: ProductService,
    private readonly priceService: PriceService,
    private readonly billService: BillService,
    private readonly location: Location,
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.controllersForm.count.valueChanges.subscribe(this.handlerChangeCount.bind(this));
  }

  loadProducts() {
    this
      .productService
      .getAllProducts({})
      .subscribe(result => {
        if (result.message) {
          alert(result.message);
        }

        this.allProducts = result.products.map(item => new Product(item));
        this.loadPrices();
      });
  }

  async loadPrices(): Promise<void> {
    this.mainFormGroup.disable();
    for (const product of this.allProducts) {
      try {
        await this.loadPrice(product);
      } catch (err) {
        console.group("loadPrices");
        console.log(err);
        console.groupEnd();
      }
    }

    this.products = this.allProducts;
    this.mainFormGroup.enable();
  }

  async loadPrice(product: Product): Promise<void> {
    return new Promise(res => {
      this
        .priceService
        .getPriceByProductId(product._id)
        .subscribe(result => {
          if (result.price) {
            product.setPrice(result.price);
          }

          res();
        })
    });
  }

  syncProductList() {
    let total = 0;
    const selectedProducts = this.shoppingCar.map(item => {
      total += item.value.subTotal;
      return item.value.product;
    });

    this.products = this.allProducts.filter(product => !selectedProducts.includes(product._id));
    this.total = total;
  }

  handlerAddProduct() {
    const { count, product: productId, subTotal } = this.mainFormGroup.value;

    const product = this.allProducts.find(product => product._id === productId);

    const countControl = new FormControl(count, [Validators.required, Validators.min(1)]);
    const subTotalControl = new FormControl(subTotal, [Validators.required]);
    const shoppingItem = new FormGroup({
      count: countControl,
      product: new FormControl(productId, [Validators.required]),
      subTotal: subTotalControl,
    });

    countControl
      .valueChanges
      .subscribe((newCount) => {
        const newValue = newCount ?? 0;

        if (product?.price) {
          subTotalControl.setValue(newValue * product.price.amount);
          this.syncProductList();
        }
      });

    this.shoppingCar.push(shoppingItem);

    this.mainFormGroup.setValue({
      count: 0,
      product: '',
      subTotal: 0
    });
    this.syncProductList();
  }

  handlerChangeCount(newValue: any) {
    const productId = this.controllersForm.product.value;

    if (!productId) {
      return;
    }

    const product = this.allProducts.find(product => product._id === productId);

    if (!product?.price) {
      return;
    }

    const count = newValue ?? 0;

    this.controllersForm.subTotal.setValue(product.price.amount * count);
  }

  deleteShoppingItem(shopItem: FormGroup) {
    const { product: productId } = shopItem.value;

    const newShoppingCard = this.shoppingCar.filter(item => item.value.product !== productId)

    this.shoppingCar = newShoppingCard;

    this.syncProductList();
  }

  handlerSubmitBill() {
    this.mainFormGroup.disable();
    this.mainFormGroup.setValue({
      count: 0,
      product: '',
      subTotal: 0,
    });

    const shoppingItems: CreateBillItemInput[] = this.shoppingCar.map(shopItem => {
      const product = this.allProducts.find(product => product._id === shopItem.value.product);

      return {
        coin: product?.price?.coin ?? '',
        count: shopItem.value.count,
        price: product?.price?.amount ?? 0,
        productId: shopItem.value.product,
      }
    });

    this
      .billService
      .createBill({
        sellers: shoppingItems,
      })
      .subscribe(res => {
        if (res.message) {
          alert("No se pudo guardar la orden");
        }

        if (!res.message) {
          alert("Se guardo la orden");
        }

        this.shoppingCar = [];
        this.syncProductList();
        this.mainFormGroup.enable();
      })
  }

  handlerBack() {
    this.location.back()
  }
}
