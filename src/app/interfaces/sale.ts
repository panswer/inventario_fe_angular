import { ProductInterface } from "./product";

export interface SaleInterface {
    _id: string;
    count: number;
    productId: string | ProductInterface;
    price: number;
    userId: string;
    createdAt: number;
    updatedAt: number;
}
