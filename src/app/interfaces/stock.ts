import { PriceInterface } from './price';

export interface WarehouseInfoInterface {
  _id: string;
  name: string;
  address: string;
  isEnabled: boolean;
}

export interface CategoryInfoInterface {
  _id: string;
  name: string;
  isEnabled: boolean;
}

export interface ProductInfoInterface {
  _id: string;
  name: string;
  inStock: boolean;
  categories: CategoryInfoInterface[];
}

export interface StockInterface {
  _id: string;
  quantity: number;
  minQuantity: number;
  warehouseId: WarehouseInfoInterface;
  productId: ProductInfoInterface;
  price?: PriceInterface;
}
