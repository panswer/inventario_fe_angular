import { WarehouseInterface } from '../warehouse';

export type { WarehouseInterface };

export interface GetAllWarehousesInput {
  page?: number;
  limit?: number;
}

export interface GetAllWarehousesOutput {
  warehouses: WarehouseInterface[];
  total: number;
  message?: string;
}

export interface GetWarehouseByIdOutput {
  warehouse: WarehouseInterface;
  message?: string;
}

export interface CreateWarehouseInput {
  name: string;
  address: string;
}

export interface CreateWarehouseOutput {
  warehouse: WarehouseInterface;
  message?: string;
}

export interface UpdateWarehouseInput {
  name?: string;
  address?: string;
  isEnabled?: boolean;
}

export interface UpdateWarehouseOutput {
  warehouse: WarehouseInterface;
  message?: string;
}
