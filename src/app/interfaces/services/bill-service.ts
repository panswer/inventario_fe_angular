import { Bill } from "../bill";

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
