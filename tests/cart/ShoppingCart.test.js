/**
 * STARTER TESTS for ShoppingCart — has some basic tests.
 * Used in Module 1 (test generation) and Module 2 (refactoring safety net).
 */

const ShoppingCart = require('../../src/cart/ShoppingCart');

describe('ShoppingCart', () => {
  let cart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  describe('addItem', () => {
    test('should add a new item to the cart', () => {
      const item = cart.addItem('Widget', 9.99, 2);
      expect(item).toEqual({ name: 'Widget', price: 9.99, quantity: 2 });
      expect(cart.items).toHaveLength(1);
    });

    test('should increase quantity if item already exists', () => {
      cart.addItem('Widget', 9.99, 2);
      cart.addItem('Widget', 9.99, 3);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(5);
    });

    test('should throw error for invalid parameters', () => {
      expect(() => cart.addItem('', 10, 1)).toThrow();
      expect(() => cart.addItem('Widget', -1, 1)).toThrow();
      expect(() => cart.addItem('Widget', 10, 0)).toThrow();
    });
  });

  describe('getSubtotal', () => {
    test('should return 0 for empty cart', () => {
      expect(cart.getSubtotal()).toBe(0);
    });

    test('should calculate subtotal correctly', () => {
      cart.addItem('Widget', 10.00, 2);
      cart.addItem('Gadget', 25.50, 1);
      expect(cart.getSubtotal()).toBe(45.50);
    });
  });

  // TODO: Use Copilot to generate tests for:
  // - removeItem
  // - updateQuantity
  // - applyDiscount (all codes)
  // - getDiscountAmount
  // - getTax
  // - getTotal
  // - getItemCount
  // - clear
  // - getSummary
});
