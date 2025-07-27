import { PriceInterface } from "../price";

export interface GetPriceByProductIdOutput {
    price?: PriceInterface;
    message?: string;
}

export interface UpdatePriceByIdData {
    amount: number;
    coin: string;
    isActive: boolean;
}

export interface UpdatePriceByIdInput {
    priceId: string;
    data: UpdatePriceByIdData;
}

export interface UpdatePriceByIdOutput {
    price?: PriceInterface;
    message?: string;
}
