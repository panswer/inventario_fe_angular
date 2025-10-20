import { PriceInterface } from '../interfaces/price';
import { ProductInterface } from '../interfaces/product';
import { Price } from './price';
import { Product } from './product';

describe('Product', () => {
  let mockProductData: ProductInterface;

  beforeEach(() => {
    mockProductData = {
      _id: 'prod-001',
      name: 'Laptop Pro',
      inStock: true,
      createdAt: Date.now(),
      createdBy: 'admin-user',
      updatedAt: Date.now(),
    };
  });

  it('debería crear una instancia y asignar propiedades correctamente desde el constructor', () => {
    const product = new Product(mockProductData);

    expect(product).toBeTruthy();
    expect(product._id).toBe('prod-001');
    expect(product.name).toBe('Laptop Pro');
    expect(product.inStock).toBeTrue();
    expect(product.createdBy).toBe('admin-user');
    expect(product.price).toBeUndefined();
  });

  it('debería establecer el precio usando el método setPrice', () => {
    const product = new Product(mockProductData);
    const mockPriceData: PriceInterface = {
      _id: 'price-xyz',
      amount: 1500.99,
      coin: 'USD',
      productId: 'prod-001',
      createdAt: Date.now(),
      createdBy: 'admin-user',
      updatedAt: Date.now(),
    };
    const price = new Price(mockPriceData);

    product.setPrice(price);

    expect(product.price).toBeInstanceOf(Price);
    expect(product.price?.amount).toBe(1500.99);
    expect(product.price?.coin).toBe('USD');
  });
});
