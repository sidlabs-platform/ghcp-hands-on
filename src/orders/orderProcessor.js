/**
 * Order processing module.
 */

const fs = require('fs');
const path = require('path');

const TAX_RATES = {
  CA: 0.0725,
  NY: 0.08,
  TX: 0.0625,
  FL: 0.06,
  WA: 0.065,
  OR: 0,
  NV: 0.0685,
  IL: 0.0625,
  PA: 0.06,
  OH: 0.0575
};

const DEFAULT_TAX_RATE = 0.05;
const FREE_SHIPPING_THRESHOLD = 100;
const REDUCED_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING_COST = 9.99;
const REDUCED_SHIPPING_COST = 4.99;
const MIN_CARD_LENGTH = 13;
const MAX_CARD_LENGTH = 19;

let orderCounter = 1000;

/**
 * Validates customer information fields.
 * @param {Object} customerInfo - Customer information object.
 * @returns {{ valid: boolean, error?: string }} Validation result.
 */
function validateCustomerInfo(customerInfo) {
  if (!customerInfo.name) return { valid: false, error: 'Customer name is required' };
  if (!customerInfo.email) return { valid: false, error: 'Customer email is required' };
  if (!customerInfo.address) return { valid: false, error: 'Customer address is required' };
  if (!customerInfo.address.street) return { valid: false, error: 'Street address is required' };
  if (!customerInfo.address.city) return { valid: false, error: 'City is required' };
  if (!customerInfo.address.state) return { valid: false, error: 'State is required' };
  if (!customerInfo.address.zip) return { valid: false, error: 'ZIP code is required' };
  return { valid: true };
}

/**
 * Validates payment information fields.
 * @param {Object} paymentInfo - Payment information object.
 * @returns {{ valid: boolean, error?: string }} Validation result.
 */
function validatePaymentInfo(paymentInfo) {
  if (!paymentInfo.cardNumber) return { valid: false, error: 'Card number is required' };
  if (!paymentInfo.expiry) return { valid: false, error: 'Card expiry is required' };
  if (!paymentInfo.cvv) return { valid: false, error: 'CVV is required' };
  const cleanCard = paymentInfo.cardNumber.replace(/[\s-]/g, '');
  if (cleanCard.length < MIN_CARD_LENGTH || cleanCard.length > MAX_CARD_LENGTH) {
    return { valid: false, error: 'Invalid card number' };
  }
  return { valid: true };
}

/**
 * Validates that a cart is non-empty.
 * @param {Object} cart - Shopping cart object.
 * @returns {{ valid: boolean, error?: string }} Validation result.
 */
function validateCart(cart) {
  if (!cart || !cart.items || cart.items.length === 0) {
    return { valid: false, error: 'Cart is empty' };
  }
  return { valid: true };
}

/**
 * Calculates the subtotal from cart items.
 * @param {Array<{price: number, quantity: number}>} items - Cart items.
 * @returns {number} Subtotal rounded to 2 decimal places.
 */
function calculateSubtotal(items) {
  const raw = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.round(raw * 100) / 100;
}

/**
 * Calculates the shipping cost based on order subtotal.
 * @param {number} subtotal - Order subtotal.
 * @returns {number} Shipping cost.
 */
function calculateShipping(subtotal) {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  if (subtotal >= REDUCED_SHIPPING_THRESHOLD) return REDUCED_SHIPPING_COST;
  return STANDARD_SHIPPING_COST;
}

/**
 * Calculates the tax amount for a given subtotal and US state.
 * @param {number} subtotal - Order subtotal.
 * @param {string} state - US state abbreviation.
 * @returns {number} Tax amount rounded to 2 decimal places.
 */
function calculateTax(subtotal, state) {
  const taxRate = TAX_RATES[state] !== undefined ? TAX_RATES[state] : DEFAULT_TAX_RATE;
  return Math.round(subtotal * taxRate * 100) / 100;
}

/**
 * Builds the order items array from cart items.
 * @param {Array<{name: string, price: number, quantity: number}>} items - Cart items.
 * @returns {Array<{name: string, price: number, quantity: number, lineTotal: number}>} Order items.
 */
function buildOrderItems(items) {
  return items.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    lineTotal: Math.round(item.price * item.quantity * 100) / 100
  }));
}

/**
 * Builds the order confirmation message.
 * @param {Object} order - Completed order object.
 * @param {string} customerName - Customer's name.
 * @returns {string} Formatted confirmation message.
 */
function buildConfirmationMessage(order, customerName) {
  const itemLines = order.items
    .map(item => `  - ${item.name} x${item.quantity} = $${item.lineTotal.toFixed(2)}`)
    .join('\n');
  return [
    `Thank you, ${customerName}!`,
    `Your order ${order.orderId} has been placed.`,
    '',
    'Items:',
    itemLines,
    '',
    `Subtotal: $${order.subtotal.toFixed(2)}`,
    `Shipping: $${order.shipping.toFixed(2)}`,
    `Tax: $${order.tax.toFixed(2)}`,
    `Total: $${order.total.toFixed(2)}`
  ].join('\n');
}

/**
 * Persists an order to the file system.
 * @param {Object} order - Order object to save.
 * @throws {Error} If the directory cannot be created or the file cannot be written.
 */
function saveOrder(order) {
  const ordersDir = path.join(__dirname, '../../data/orders');
  if (!fs.existsSync(ordersDir)) {
    fs.mkdirSync(ordersDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(ordersDir, `${order.orderId}.json`),
    JSON.stringify(order, null, 2)
  );
}

/**
 * Processes a customer order: validates inputs, calculates totals, and saves the order.
 * @param {Object} cart - Shopping cart with items array.
 * @param {Object} customerInfo - Customer information including name, email, and address.
 * @param {Object} paymentInfo - Payment information including card details.
 * @returns {{ success: boolean, order?: Object, message?: string, error?: string }} Result.
 */
function processOrder(cart, customerInfo, paymentInfo) {
  const customerValidation = validateCustomerInfo(customerInfo);
  if (!customerValidation.valid) return { success: false, error: customerValidation.error };

  const paymentValidation = validatePaymentInfo(paymentInfo);
  if (!paymentValidation.valid) return { success: false, error: paymentValidation.error };

  const cartValidation = validateCart(cart);
  if (!cartValidation.valid) return { success: false, error: cartValidation.error };

  const subtotal = calculateSubtotal(cart.items);
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal, customerInfo.address.state);
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  orderCounter++;
  const order = {
    orderId: `ORD-${orderCounter}`,
    customer: {
      name: customerInfo.name,
      email: customerInfo.email,
      address: customerInfo.address
    },
    items: buildOrderItems(cart.items),
    subtotal,
    shipping,
    tax,
    total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  try {
    saveOrder(order);
  } catch (err) {
    return { success: false, error: `Failed to save order: ${err.message}` };
  }

  return {
    success: true,
    order,
    message: buildConfirmationMessage(order, customerInfo.name)
  };
}

/**
 * Retrieves an order by its ID.
 * @param {string} orderId - The order ID.
 * @returns {Object|null} The order object, or null if not found.
 */
function getOrderStatus(orderId) {
  try {
    const filePath = path.join(__dirname, '../../data/orders', `${orderId}.json`);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

/**
 * Cancels a pending order by its ID.
 * @param {string} orderId - The order ID to cancel.
 * @returns {{ success: boolean, order?: Object, error?: string }} Result.
 */
function cancelOrder(orderId) {
  const order = getOrderStatus(orderId);
  if (!order) return { success: false, error: 'Order not found' };
  if (order.status !== 'pending') {
    return { success: false, error: 'Only pending orders can be cancelled' };
  }
  order.status = 'cancelled';
  try {
    const filePath = path.join(__dirname, '../../data/orders', `${orderId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(order, null, 2));
    return { success: true, order };
  } catch (err) {
    return { success: false, error: 'Failed to update order' };
  }
}

module.exports = {
  processOrder,
  getOrderStatus,
  cancelOrder,
  validateCustomerInfo,
  validatePaymentInfo,
  validateCart,
  calculateSubtotal,
  calculateShipping,
  calculateTax,
  buildOrderItems,
  buildConfirmationMessage
};
