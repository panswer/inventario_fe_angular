import { ProductInterface } from '../product';

export interface GetAllProductsInput {
  page?: number;
  limit?: number;
}

export interface GetAllProductsOutput {
  products: ProductInterface[];
  total: number;
  message?: string;
}
