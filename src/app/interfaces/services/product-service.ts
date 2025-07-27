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

export interface GetProductByIdOutput {
  product?: ProductInterface;
  message?: string;
}

export interface UpdateProductByIdData {
  inStock: boolean;
  name: string;
}

export interface UpdateProductByIdInput {
  productId: string;
  data: UpdateProductByIdData;
}

export interface UpdateProductByIdOutput {
  product?: ProductInterface;
  message?: string;
}
