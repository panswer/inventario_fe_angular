import { Price } from '../models/price';
import { Product } from '../models/product';
import { PriceInterface } from './price';
import { ProductInterface } from './product';

export interface CreateProduct {
  name: string;
  amount: number;
  coin: string;
}

export interface CreateProductResultInterface {
  product: ProductInterface;
  price: PriceInterface;
}

export interface CreateProductResult {
  product?: Product;
  price?: Price;
  message?: string;
}
