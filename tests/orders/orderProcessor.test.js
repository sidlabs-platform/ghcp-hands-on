const fs = require('fs');
const path = require('path');
const {
  validateCustomerInfo,
  validatePaymentInfo,
  validateCart,
  calculateSubtotal,
  calculateShipping,
  calculateTax,
  buildOrderItems,
  buildConfirmationMessage,
  processOrder,
  getOrderStatus,
  cancelOrder
} = require('../../src/orders/orderProcessor');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeCustomer = (overrides = {}) => ({
  name: 'Alice',
  email: 'alice@example.com',
  address: {
    street: '123 Main St',
    city: 'Springfield',
    state: 'CA',
    zip: '90210'
  },
  ...overrides
});

const makePayment = (overrides = {}) => ({
  cardNumber: '4111111111111111',
  expiry: '12/27',
  cvv: '123',
  ...overrides
});

const makeCart = (items = [{ name: 'Widget', price: 20, quantity: 3 }]) => ({ items });

// ─── validateCustomerInfo ──────────────────────────────────────────────────────

describe('validateCustomerInfo', () => {
  test('should return valid when all required fields are present', () => {
    const result = validateCustomerInfo(makeCustomer());

    expect(result).toEqual({ valid: true });
  });

  test('should return error when name is missing', () => {
    const result = validateCustomerInfo(makeCustomer({ name: '' }));

    expect(result).toEqual({ valid: false, error: 'Customer name is required' });
  });

  test('should return error when email is missing', () => {
    const result = validateCustomerInfo(makeCustomer({ email: '' }));

    expect(result).toEqual({ valid: false, error: 'Customer email is required' });
  });

  test('should return error when address is missing', () => {
    const result = validateCustomerInfo(makeCustomer({ address: null }));

    expect(result).toEqual({ valid: false, error: 'Customer address is required' });
  });

  test('should return error when street is missing', () => {
    const customer = makeCustomer({ address: { street: '', city: 'X', state: 'CA', zip: '00000' } });
    const result = validateCustomerInfo(customer);

    expect(result).toEqual({ valid: false, error: 'Street address is required' });
  });

  test('should return error when city is missing', () => {
    const customer = makeCustomer({ address: { street: '1 Main', city: '', state: 'CA', zip: '00000' } });
    const result = validateCustomerInfo(customer);

    expect(result).toEqual({ valid: false, error: 'City is required' });
  });

  test('should return error when state is missing', () => {
    const customer = makeCustomer({ address: { street: '1 Main', city: 'X', state: '', zip: '00000' } });
    const result = validateCustomerInfo(customer);

    expect(result).toEqual({ valid: false, error: 'State is required' });
  });

  test('should return error when zip is missing', () => {
    const customer = makeCustomer({ address: { street: '1 Main', city: 'X', state: 'CA', zip: '' } });
    const result = validateCustomerInfo(customer);

    expect(result).toEqual({ valid: false, error: 'ZIP code is required' });
  });
});

// ─── validatePaymentInfo ───────────────────────────────────────────────────────

describe('validatePaymentInfo', () => {
  test('should return valid when all required fields are present', () => {
    const result = validatePaymentInfo(makePayment());

    expect(result).toEqual({ valid: true });
  });

  test('should return error when cardNumber is missing', () => {
    const result = validatePaymentInfo(makePayment({ cardNumber: '' }));

    expect(result).toEqual({ valid: false, error: 'Card number is required' });
  });

  test('should return error when expiry is missing', () => {
    const result = validatePaymentInfo(makePayment({ expiry: '' }));

    expect(result).toEqual({ valid: false, error: 'Card expiry is required' });
  });

  test('should return error when cvv is missing', () => {
    const result = validatePaymentInfo(makePayment({ cvv: '' }));

    expect(result).toEqual({ valid: false, error: 'CVV is required' });
  });

  test('should return error when card number is too short', () => {
    const result = validatePaymentInfo(makePayment({ cardNumber: '123456789012' }));

    expect(result).toEqual({ valid: false, error: 'Invalid card number' });
  });

  test('should return error when card number is too long', () => {
    const result = validatePaymentInfo(makePayment({ cardNumber: '12345678901234567890' }));

    expect(result).toEqual({ valid: false, error: 'Invalid card number' });
  });

  test('should accept card numbers with spaces and dashes', () => {
    const result = validatePaymentInfo(makePayment({ cardNumber: '4111-1111-1111-1111' }));

    expect(result).toEqual({ valid: true });
  });
});

// ─── validateCart ──────────────────────────────────────────────────────────────

describe('validateCart', () => {
  test('should return valid when cart has items', () => {
    const result = validateCart(makeCart());

    expect(result).toEqual({ valid: true });
  });

  test('should return error when cart is null', () => {
    const result = validateCart(null);

    expect(result).toEqual({ valid: false, error: 'Cart is empty' });
  });

  test('should return error when cart has no items array', () => {
    const result = validateCart({});

    expect(result).toEqual({ valid: false, error: 'Cart is empty' });
  });

  test('should return error when cart items array is empty', () => {
    const result = validateCart(makeCart([]));

    expect(result).toEqual({ valid: false, error: 'Cart is empty' });
  });
});

// ─── calculateSubtotal ────────────────────────────────────────────────────────

describe('calculateSubtotal', () => {
  test('should return sum of price × quantity for all items', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5.5, quantity: 4 }
    ];

    const result = calculateSubtotal(items);

    expect(result).toBe(42);
  });

  test('should round to 2 decimal places', () => {
    const items = [{ price: 0.1, quantity: 3 }];

    const result = calculateSubtotal(items);

    expect(result).toBe(0.3);
  });

  test('should return 0 for an empty items array', () => {
    const result = calculateSubtotal([]);

    expect(result).toBe(0);
  });
});

// ─── calculateShipping ────────────────────────────────────────────────────────

describe('calculateShipping', () => {
  test('should return standard shipping cost when subtotal is below $50', () => {
    const result = calculateShipping(49.99);

    expect(result).toBe(9.99);
  });

  test('should return reduced shipping cost when subtotal is $50 or more but below $100', () => {
    expect(calculateShipping(50)).toBe(4.99);
    expect(calculateShipping(99.99)).toBe(4.99);
  });

  test('should return free shipping when subtotal is $100 or more', () => {
    expect(calculateShipping(100)).toBe(0);
    expect(calculateShipping(200)).toBe(0);
  });
});

// ─── calculateTax ─────────────────────────────────────────────────────────────

describe('calculateTax', () => {
  test('should apply CA tax rate of 7.25%', () => {
    const result = calculateTax(100, 'CA');

    expect(result).toBe(7.25);
  });

  test('should apply NY tax rate of 8%', () => {
    const result = calculateTax(100, 'NY');

    expect(result).toBe(8);
  });

  test('should apply zero tax for OR', () => {
    const result = calculateTax(100, 'OR');

    expect(result).toBe(0);
  });

  test('should apply default tax rate of 5% for unknown state', () => {
    const result = calculateTax(100, 'ZZ');

    expect(result).toBe(5);
  });

  test('should round result to 2 decimal places', () => {
    // TX: 6.25% of $33 = 2.0625 → rounds to 2.06
    const result = calculateTax(33, 'TX');

    expect(result).toBe(2.06);
  });
});

// ─── buildOrderItems ──────────────────────────────────────────────────────────

describe('buildOrderItems', () => {
  test('should map cart items to order items with lineTotal', () => {
    const items = [{ name: 'Widget', price: 5, quantity: 3 }];

    const result = buildOrderItems(items);

    expect(result).toEqual([{ name: 'Widget', price: 5, quantity: 3, lineTotal: 15 }]);
  });

  test('should round lineTotal to 2 decimal places', () => {
    const items = [{ name: 'Odd', price: 0.1, quantity: 3 }];

    const result = buildOrderItems(items);

    expect(result[0].lineTotal).toBe(0.3);
  });

  test('should return an empty array for no items', () => {
    const result = buildOrderItems([]);

    expect(result).toEqual([]);
  });
});

// ─── buildConfirmationMessage ─────────────────────────────────────────────────

describe('buildConfirmationMessage', () => {
  test('should include customer name and order ID', () => {
    const order = {
      orderId: 'ORD-1001',
      items: [{ name: 'Widget', quantity: 2, lineTotal: 40 }],
      subtotal: 40,
      shipping: 4.99,
      tax: 2.9,
      total: 47.89
    };

    const result = buildConfirmationMessage(order, 'Bob');

    expect(result).toContain('Thank you, Bob!');
    expect(result).toContain('ORD-1001');
  });

  test('should include item details and totals', () => {
    const order = {
      orderId: 'ORD-1002',
      items: [{ name: 'Gadget', quantity: 1, lineTotal: 50 }],
      subtotal: 50,
      shipping: 0,
      tax: 3,
      total: 53
    };

    const result = buildConfirmationMessage(order, 'Carol');

    expect(result).toContain('Gadget x1 = $50.00');
    expect(result).toContain('Subtotal: $50.00');
    expect(result).toContain('Shipping: $0.00');
    expect(result).toContain('Tax: $3.00');
    expect(result).toContain('Total: $53.00');
  });
});

// ─── processOrder (integration) ───────────────────────────────────────────────

describe('processOrder', () => {
  const ordersDir = path.join(__dirname, '../../data/orders');

  afterEach(() => {
    // Clean up any order files created during tests
    if (fs.existsSync(ordersDir)) {
      fs.readdirSync(ordersDir).forEach(file => {
        fs.unlinkSync(path.join(ordersDir, file));
      });
    }
  });

  test('should return success and a valid order on happy path', () => {
    const result = processOrder(makeCart(), makeCustomer(), makePayment());

    expect(result.success).toBe(true);
    expect(result.order).toBeDefined();
    expect(result.order.status).toBe('pending');
    expect(result.message).toContain('Thank you, Alice!');
  });

  test('should return error when customer info is invalid', () => {
    const result = processOrder(makeCart(), makeCustomer({ name: '' }), makePayment());

    expect(result.success).toBe(false);
    expect(result.error).toBe('Customer name is required');
  });

  test('should return error when payment info is invalid', () => {
    const result = processOrder(makeCart(), makeCustomer(), makePayment({ cvv: '' }));

    expect(result.success).toBe(false);
    expect(result.error).toBe('CVV is required');
  });

  test('should return error when cart is empty', () => {
    const result = processOrder(makeCart([]), makeCustomer(), makePayment());

    expect(result.success).toBe(false);
    expect(result.error).toBe('Cart is empty');
  });

  test('should persist order file to disk', () => {
    const result = processOrder(makeCart(), makeCustomer(), makePayment());

    const filePath = path.join(ordersDir, `${result.order.orderId}.json`);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('should calculate correct totals for a CA order under $50', () => {
    const cart = makeCart([{ name: 'Item', price: 10, quantity: 2 }]);

    const result = processOrder(cart, makeCustomer({ address: { street: '1 Main', city: 'LA', state: 'CA', zip: '90001' } }), makePayment());

    expect(result.order.subtotal).toBe(20);
    expect(result.order.shipping).toBe(9.99);
    expect(result.order.tax).toBe(1.45); // 20 * 0.0725
    expect(result.order.total).toBe(31.44);
  });
});

// ─── getOrderStatus ───────────────────────────────────────────────────────────

describe('getOrderStatus', () => {
  const ordersDir = path.join(__dirname, '../../data/orders');

  afterEach(() => {
    if (fs.existsSync(ordersDir)) {
      fs.readdirSync(ordersDir).forEach(file => {
        fs.unlinkSync(path.join(ordersDir, file));
      });
    }
  });

  test('should return order data for an existing order', () => {
    const { order } = processOrder(makeCart(), makeCustomer(), makePayment());

    const result = getOrderStatus(order.orderId);

    expect(result).not.toBeNull();
    expect(result.orderId).toBe(order.orderId);
  });

  test('should return null for a non-existent order ID', () => {
    const result = getOrderStatus('ORD-NONEXISTENT');

    expect(result).toBeNull();
  });
});

// ─── cancelOrder ──────────────────────────────────────────────────────────────

describe('cancelOrder', () => {
  const ordersDir = path.join(__dirname, '../../data/orders');

  afterEach(() => {
    if (fs.existsSync(ordersDir)) {
      fs.readdirSync(ordersDir).forEach(file => {
        fs.unlinkSync(path.join(ordersDir, file));
      });
    }
  });

  test('should cancel a pending order successfully', () => {
    const { order } = processOrder(makeCart(), makeCustomer(), makePayment());

    const result = cancelOrder(order.orderId);

    expect(result.success).toBe(true);
    expect(result.order.status).toBe('cancelled');
  });

  test('should return error for a non-existent order', () => {
    const result = cancelOrder('ORD-NONEXISTENT');

    expect(result).toEqual({ success: false, error: 'Order not found' });
  });

  test('should return error when trying to cancel a non-pending order', () => {
    const { order } = processOrder(makeCart(), makeCustomer(), makePayment());
    cancelOrder(order.orderId); // cancel once

    const result = cancelOrder(order.orderId); // try to cancel again

    expect(result).toEqual({ success: false, error: 'Only pending orders can be cancelled' });
  });
});
