import { PriceInterface } from '../interfaces/price';
import { Price } from './price';

describe('Price', () => {
  let mockPriceData: PriceInterface;

  beforeEach(() => {
    mockPriceData = {
      _id: 'price-001',
      amount: 1299.99,
      coin: 'USD',
      productId: 'prod-abc',
      createdAt: Date.now(),
      createdBy: 'user-xyz',
      updatedAt: Date.now(),
    };
  });

  it('debería crear una instancia y asignar propiedades correctamente', () => {
    const price = new Price(mockPriceData);

    expect(price).toBeTruthy();
    expect(price._id).toBe('price-001');
    expect(price.amount).toBe(1299.99);
    expect(price.coin).toBe('USD');
    expect(price.productId).toBe('prod-abc');
    expect(price.createdBy).toBe('user-xyz');
    expect(price.createdAt).toBe(mockPriceData.createdAt);
    expect(price.updatedAt).toBe(mockPriceData.updatedAt);
  });
});
