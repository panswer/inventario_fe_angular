import { StockInterface } from '../stock';

export type { StockInterface };

export interface GetAllStocksInput {
  page?: number;
  limit?: number;
  warehouseId?: string;
}

export interface GetAllStocksOutput {
  stocks: StockInterface[];
  total: number;
  message?: string;
}

export interface GetStockByProductIdInput {
  productId: string;
}

export interface GetStockByProductIdOutput {
  stock?: StockInterface;
  message?: string;
}

export interface GetStockByIdInput {
  stockId: string;
}

export interface GetStockByIdOutput {
  stock?: StockInterface;
  message?: string;
}

export interface UpdateStockMinQuantityInput {
  stockId: string;
  minQuantity: number;
}

export interface UpdateStockMinQuantityOutput {
  stock?: StockInterface;
  message?: string;
}

export interface AddStockAmountInput {
  stockId: string;
  amount: number;
}

export interface AddStockAmountOutput {
  stock?: StockInterface;
  message?: string;
}

export interface RemoveStockAmountInput {
  stockId: string;
  amount: number;
}

export interface RemoveStockAmountOutput {
  stock?: StockInterface;
  message?: string;
}

export interface TransferStockInput {
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
}

export interface TransferStockOutput {
  fromStock?: StockInterface;
  toStock?: StockInterface;
  message?: string;
}

export interface GetStocksByProductOutput {
  stocks: StockInterface[];
  message?: string;
}

export interface CreateStockInput {
  productId: string;
  warehouseId: string;
  quantity?: number;
  minQuantity?: number;
}

export interface CreateStockOutput {
  stock?: StockInterface;
  message?: string;
}
