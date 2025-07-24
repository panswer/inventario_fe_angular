import { PriceInterface } from '../interfaces/price';

export class Price implements PriceInterface {
  _id: string;
  amount: number;
  coin: string;
  createdAt: number;
  createdBy: string;
  isActive: boolean;
  productId: string;
  updatedAt: number;

  constructor(params: PriceInterface) {
    this._id = params._id;
    this.amount = params.amount;
    this.coin = params.coin;
    this.createdAt = params.createdAt;
    this.createdBy = params.createdBy;
    this.isActive = params.isActive;
    this.productId = params.productId;
    this.updatedAt = params.updatedAt;
  }
}
