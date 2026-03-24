import { StockInterface } from '../stock';

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
