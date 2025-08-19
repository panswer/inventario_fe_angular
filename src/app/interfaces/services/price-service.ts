import { PriceInterface } from "../price";

export interface GetPriceByProductIdOutput {
    price?: PriceInterface;
    message?: string;
}

export interface UpdatePriceByIdData {
    amount: number;
}

export interface UpdatePriceByIdInput {
    priceId: string;
    coin: string;
    data: UpdatePriceByIdData;
}

export interface UpdatePriceByIdOutput {
    price?: PriceInterface;
    message?: string;
}
