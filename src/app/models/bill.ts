import { Bill as BillInterface } from "../interfaces/bill";

export class Bill implements BillInterface {
    _id: string;
    createdAt: number;
    updatedAt: number;
    userId: string;

    constructor(params: BillInterface) {
        this._id = params._id;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.userId = params.userId;
    }
}
