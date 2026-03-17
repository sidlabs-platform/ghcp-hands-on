/**
 * Order processing module — legacy code with multiple code smells.
 * Target for refactoring in Module 2.
 */

const fs = require('fs');
const path = require('path');

// Global mutable state
var orderCounter = 1000;

function processOrder(cart, customerInfo, paymentInfo) {
  // Giant function doing too many things
  
  // 1. Validate customer info
  if (!customerInfo.name) {
    return { success: false, error: 'Customer name is required' };
  }
  if (!customerInfo.email) {
    return { success: false, error: 'Customer email is required' };
  }
  if (!customerInfo.address) {
    return { success: false, error: 'Customer address is required' };
  }
  if (!customerInfo.address.street) {
    return { success: false, error: 'Street address is required' };
  }
  if (!customerInfo.address.city) {
    return { success: false, error: 'City is required' };
  }
  if (!customerInfo.address.state) {
    return { success: false, error: 'State is required' };
  }
  if (!customerInfo.address.zip) {
    return { success: false, error: 'ZIP code is required' };
  }

  // 2. Validate payment
  if (!paymentInfo.cardNumber) {
    return { success: false, error: 'Card number is required' };
  }
  if (!paymentInfo.expiry) {
    return { success: false, error: 'Card expiry is required' };
  }
  if (!paymentInfo.cvv) {
    return { success: false, error: 'CVV is required' };
  }

  // Check card number length (simplified)
  var cleanCard = paymentInfo.cardNumber.replace(/[\s\-]/g, '');
  if (cleanCard.length < 13 || cleanCard.length > 19) {
    return { success: false, error: 'Invalid card number' };
  }

  // 3. Check cart is not empty
  if (!cart || !cart.items || cart.items.length === 0) {
    return { success: false, error: 'Cart is empty' };
  }

  // 4. Calculate totals (duplicating cart logic)
  var subtotal = 0;
  for (var i = 0; i < cart.items.length; i++) {
    subtotal += cart.items[i].price * cart.items[i].quantity;
  }
  subtotal = Math.round(subtotal * 100) / 100;

  // 5. Apply shipping
  var shipping = 0;
  if (subtotal < 50) {
    shipping = 9.99;
  } else if (subtotal < 100) {
    shipping = 4.99;
  } else {
    shipping = 0; // Free shipping over $100
  }

  // 6. Calculate tax (hardcoded rates by state - code smell)
  var taxRate = 0;
  if (customerInfo.address.state === 'CA') taxRate = 0.0725;
  else if (customerInfo.address.state === 'NY') taxRate = 0.08;
  else if (customerInfo.address.state === 'TX') taxRate = 0.0625;
  else if (customerInfo.address.state === 'FL') taxRate = 0.06;
  else if (customerInfo.address.state === 'WA') taxRate = 0.065;
  else if (customerInfo.address.state === 'OR') taxRate = 0;
  else if (customerInfo.address.state === 'NV') taxRate = 0.0685;
  else if (customerInfo.address.state === 'IL') taxRate = 0.0625;
  else if (customerInfo.address.state === 'PA') taxRate = 0.06;
  else if (customerInfo.address.state === 'OH') taxRate = 0.0575;
  else taxRate = 0.05; // Default

  var tax = Math.round(subtotal * taxRate * 100) / 100;
  var total = Math.round((subtotal + shipping + tax) * 100) / 100;

  // 7. Generate order
  orderCounter++;
  var order = {
    orderId: 'ORD-' + orderCounter,
    customer: {
      name: customerInfo.name,
      email: customerInfo.email,
      address: customerInfo.address
    },
    items: [],
    subtotal: subtotal,
    shipping: shipping,
    tax: tax,
    total: total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  // Copy items
  for (var j = 0; j < cart.items.length; j++) {
    order.items.push({
      name: cart.items[j].name,
      price: cart.items[j].price,
      quantity: cart.items[j].quantity,
      lineTotal: Math.round(cart.items[j].price * cart.items[j].quantity * 100) / 100
    });
  }

  // 8. Save order to file (side effect mixed with business logic)
  try {
    var ordersDir = path.join(__dirname, '../../data/orders');
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(ordersDir, order.orderId + '.json'),
      JSON.stringify(order, null, 2)
    );
  } catch (err) {
    // Swallowed error — another code smell
  }

  // 9. Generate confirmation message (presentation logic in business layer)
  var message = 'Thank you, ' + customerInfo.name + '!\n';
  message += 'Your order ' + order.orderId + ' has been placed.\n';
  message += '\nItems:\n';
  for (var k = 0; k < order.items.length; k++) {
    message += '  - ' + order.items[k].name + ' x' + order.items[k].quantity;
    message += ' = $' + order.items[k].lineTotal.toFixed(2) + '\n';
  }
  message += '\nSubtotal: $' + subtotal.toFixed(2) + '\n';
  message += 'Shipping: $' + shipping.toFixed(2) + '\n';
  message += 'Tax: $' + tax.toFixed(2) + '\n';
  message += 'Total: $' + total.toFixed(2) + '\n';

  return {
    success: true,
    order: order,
    message: message
  };
}

function getOrderStatus(orderId) {
  try {
    var filePath = path.join(__dirname, '../../data/orders', orderId + '.json');
    var data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

function cancelOrder(orderId) {
  var order = getOrderStatus(orderId);
  if (!order) return { success: false, error: 'Order not found' };
  if (order.status !== 'pending') {
    return { success: false, error: 'Only pending orders can be cancelled' };
  }
  order.status = 'cancelled';
  try {
    var filePath = path.join(__dirname, '../../data/orders', orderId + '.json');
    fs.writeFileSync(filePath, JSON.stringify(order, null, 2));
    return { success: true, order: order };
  } catch (err) {
    return { success: false, error: 'Failed to update order' };
  }
}

module.exports = { processOrder, getOrderStatus, cancelOrder };
