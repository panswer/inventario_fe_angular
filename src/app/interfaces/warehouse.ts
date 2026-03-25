export interface WarehouseInterface {
  _id: string;
  name: string;
  address: string;
  isEnabled: boolean;
  createdBy: {
    _id: string;
    username: string;
  };
  createdAt: number;
  updatedAt: number;
}
