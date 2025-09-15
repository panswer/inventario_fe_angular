import { Bill } from "../bill";
import { SaleInterface } from "../sale";

export interface GetBillsInput {
    page?: number;
    limit?: number;
}

export interface GetBillsOutput {
    bills: Bill[];
    total: number;
    message?: string;
}

export interface CreateBillItemInput {
    count: number;
    productId: string;
    price: number;
    coin: string;
}

export interface CreateBillInput {
    sellers: CreateBillItemInput[];
}

export interface CreateBillOutput {
    message?: string;
}

export interface BillDetail extends Bill {
    sales: SaleInterface[];
    total: number;
}

export interface GetBillDetailByBillIdOutput {
    bill?: BillDetail;
    message?: string;
}
