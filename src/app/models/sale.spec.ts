import { ProductInterface } from '../interfaces/product';
import { SaleInterface } from '../interfaces/sale';
import { Product } from './product';
import { Sale } from './sale';

describe('Sale', () => {
  let mockSaleData: SaleInterface;

  beforeEach(() => {
    mockSaleData = {
      _id: 'sale-001',
      count: 2,
      price: 50,
      productId: 'prod-123',
      userId: 'user-abc',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  });

  it('debería crear una instancia y asignar propiedades correctamente', () => {
    const sale = new Sale(mockSaleData);

    expect(sale).toBeTruthy();
    expect(sale._id).toBe('sale-001');
    expect(sale.count).toBe(2);
    expect(sale.price).toBe(50);
    expect(sale.userId).toBe('user-abc');
  });

  it('debería manejar productId como un string', () => {
    const sale = new Sale(mockSaleData);

    expect(sale.productId).toBe('prod-123');
    expect(sale.product).toBeUndefined();
  });

  it('debería manejar productId como un objeto (ProductInterface) y crear una instancia de Product', () => {
    const mockProduct: ProductInterface = {
      _id: 'prod-456',
      name: 'Test Product',
      inStock: true,
      createdAt: Date.now(),
      createdBy: 'admin',
      updatedAt: Date.now(),
    };

    const saleWithProductData: SaleInterface = {
      ...mockSaleData,
      productId: mockProduct,
    };

    const sale = new Sale(saleWithProductData);

    expect(sale.productId).toBe('prod-456');
    expect(sale.product).toBeInstanceOf(Product);
    expect(sale.product?.name).toBe('Test Product');
  });

  it('debería calcular el subTotal correctamente', () => {
    mockSaleData.price = 25.5;
    mockSaleData.count = 4;
    const sale = new Sale(mockSaleData);

    expect(sale.subTotal).toBe(102); // 25.5 * 4
  });
});
