import { SaleInterface } from "../interfaces/sale";
import { Product } from "./product";

export class Sale implements SaleInterface {
    _id: string;
    count: number;
    createdAt: number;
    price: number;
    productId: string;
    updatedAt: number;
    userId: string;
    product?: Product;

    constructor(params: SaleInterface) {
        this._id = params._id;
        this.count = params.count;
        this.createdAt = params.createdAt;
        this.price = params.price;
        if (typeof params.productId === 'string') {
            this.productId = params.productId;
        } else {
            this.productId = params.productId._id;
            this.product = new Product(params.productId);
        }
        this.updatedAt = params.updatedAt;
        this.userId = params.userId;
    }

    get subTotal() {
        return this.price * this.count;
    }
}
