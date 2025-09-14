import { ProductInterface } from '../interfaces/product';
import { Price } from './price';

export class Product implements ProductInterface {
  _id: string;
  createdAt: number;
  createdBy: string;
  inStock: boolean;
  name: string;
  updatedAt: number;
  price?: Price;

  constructor(params: ProductInterface) {
    this._id = params._id;
    this.createdAt = params.createdAt;
    this.createdBy = params.createdBy;
    this.inStock = params.inStock;
    this.name = params.name;
    this.updatedAt = params.updatedAt;
  }

  setPrice(price: Price): void {
    this.price = price;
  }
}
