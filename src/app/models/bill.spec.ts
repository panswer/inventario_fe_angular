import { Bill as BillInterface } from '../interfaces/bill';
import { SaleInterface } from '../interfaces/sale';
import { Bill } from './bill';
import { Sale } from './sale';

describe('Bill', () => {
  let mockBillData: BillInterface;

  beforeEach(() => {
    mockBillData = {
      _id: 'bill-001',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: 'user-123',
    };
  });

  it('debería crear una instancia y asignar propiedades correctamente desde el constructor', () => {
    const bill = new Bill(mockBillData);

    expect(bill).toBeTruthy();
    expect(bill._id).toBe('bill-001');
    expect(bill.userId).toBe('user-123');
    expect(bill.createdAt).toBe(mockBillData.createdAt);
    expect(bill.updatedAt).toBe(mockBillData.updatedAt);
    expect(bill.sales).toEqual([]);
    expect(bill.total).toBe(0);
  });

  it('debería establecer las ventas usando setSales y convertirlas en instancias de Sale', () => {
    const bill = new Bill(mockBillData);
    const mockSalesData: SaleInterface[] = [
      {
        _id: 'sale-01',
        count: 2,
        price: 10,
        productId: 'prod-a',
        userId: 'user-123',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        _id: 'sale-02',
        count: 1,
        price: 25,
        productId: 'prod-b',
        userId: 'user-123',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    bill.setSales(mockSalesData);

    expect(bill.sales.length).toBe(2);
    expect(bill.sales[0]).toBeInstanceOf(Sale);
    expect(bill.sales[1]).toBeInstanceOf(Sale);
    expect(bill.sales[0]._id).toBe('sale-01');
    expect(bill.sales[1].price).toBe(25);
  });

  it('debería establecer el total correctamente usando setTotal', () => {
    const bill = new Bill(mockBillData);
    const newTotal = 150.75;

    bill.setTotal(newTotal);

    expect(bill.total).toBe(newTotal);
  });
});
