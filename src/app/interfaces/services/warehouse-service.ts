import { WarehouseInterface } from '../warehouse';

export interface GetAllWarehousesInput {
  page?: number;
  limit?: number;
}

export interface GetAllWarehousesOutput {
  warehouses: WarehouseInterface[];
  total: number;
  message?: string;
}
