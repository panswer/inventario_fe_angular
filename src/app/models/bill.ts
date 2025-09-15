import { Bill as BillInterface } from "../interfaces/bill";
import { SaleInterface } from "../interfaces/sale";
import { Sale } from "./sale";

export class Bill implements BillInterface {
    _id: string;
    createdAt: number;
    updatedAt: number;
    userId: string;
    sales: Sale[] = [];
    total = 0;

    constructor(params: BillInterface) {
        this._id = params._id;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.userId = params.userId;
    }

    setSales(sales: SaleInterface[]) {
        this.sales = sales.map(saleItem => new Sale(saleItem));
    }

    setTotal(amount: number) {
        this.total = amount;
    }
}
