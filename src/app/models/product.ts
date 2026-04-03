import { ProductInterface } from '../interfaces/product';
import { Category } from './category';
import { Price } from './price';

export class Product implements ProductInterface {
  _id: string;
  createdAt: number;
  createdBy: string;
  inStock: boolean;
  name: string;
  updatedAt: number;
  barcode?: string;
  categories?: Category[];
  price?: Price;

  constructor(params: ProductInterface) {
    this._id = params._id;
    this.createdAt = params.createdAt;
    this.createdBy = params.createdBy;
    this.inStock = params.inStock;
    this.name = params.name;
    this.updatedAt = params.updatedAt;
    this.barcode = params.barcode;
    this.categories = params.categories?.map(
      (cat) => new Category(cat)
    );
  }

  setPrice(price: Price): void {
    this.price = price;
  }

  getCategoryIds(): string[] {
    return this.categories?.map((cat) => cat._id) ?? [];
  }
}
