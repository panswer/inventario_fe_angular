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
