import { CategoryInterface } from './category';

export interface ProductInterface {
  _id: string;
  name: string;
  inStock: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  barcode?: string;
  categories?: CategoryInterface[];
}
