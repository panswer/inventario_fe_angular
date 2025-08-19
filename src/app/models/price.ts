import { PriceInterface } from '../interfaces/price';

export class Price implements PriceInterface {
  _id: string;
  amount: number;
  coin: string;
  createdAt: number;
  createdBy: string;
  productId: string;
  updatedAt: number;

  constructor(params: PriceInterface) {
    this._id = params._id;
    this.amount = params.amount;
    this.coin = params.coin;
    this.createdAt = params.createdAt;
    this.createdBy = params.createdBy;
    this.productId = params.productId;
    this.updatedAt = params.updatedAt;
  }
}
