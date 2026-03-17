/**
 * Shopping cart module — handles cart operations.
 * This is intentionally written with some code smells and legacy patterns
 * for the refactoring exercise in Module 2.
 */

class ShoppingCart {
  constructor() {
    this.items = [];
    this.discountCode = null;
    this.taxRate = 0.08;
  }

  addItem(name, price, quantity) {
    if (!name || price <= 0 || quantity <= 0) {
      throw new Error('Invalid item parameters');
    }
    // Check if item already exists
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === name) {
        this.items[i].quantity += quantity;
        return this.items[i];
      }
    }
    const item = { name: name, price: price, quantity: quantity };
    this.items.push(item);
    return item;
  }

  removeItem(name) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === name) {
        this.items.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  updateQuantity(name, quantity) {
    if (quantity < 0) throw new Error('Quantity cannot be negative');
    if (quantity === 0) return this.removeItem(name);
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === name) {
        this.items[i].quantity = quantity;
        return true;
      }
    }
    return false;
  }

  getSubtotal() {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      total += this.items[i].price * this.items[i].quantity;
    }
    return Math.round(total * 100) / 100;
  }

  applyDiscount(code) {
    // Hardcoded discount codes — legacy pattern
    if (code === 'SAVE10') {
      this.discountCode = { code: code, type: 'percentage', value: 10 };
      return true;
    } else if (code === 'SAVE20') {
      this.discountCode = { code: code, type: 'percentage', value: 20 };
      return true;
    } else if (code === 'FLAT5') {
      this.discountCode = { code: code, type: 'flat', value: 5 };
      return true;
    } else if (code === 'FLAT15') {
      this.discountCode = { code: code, type: 'flat', value: 15 };
      return true;
    } else if (code === 'HALFOFF') {
      this.discountCode = { code: code, type: 'percentage', value: 50 };
      return true;
    }
    return false;
  }

  getDiscountAmount() {
    if (!this.discountCode) return 0;
    const subtotal = this.getSubtotal();
    if (this.discountCode.type === 'percentage') {
      return Math.round((subtotal * this.discountCode.value / 100) * 100) / 100;
    } else if (this.discountCode.type === 'flat') {
      return Math.min(this.discountCode.value, subtotal);
    }
    return 0;
  }

  getTax() {
    const afterDiscount = this.getSubtotal() - this.getDiscountAmount();
    return Math.round(afterDiscount * this.taxRate * 100) / 100;
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscountAmount();
    const tax = this.getTax();
    return Math.round((subtotal - discount + tax) * 100) / 100;
  }

  getItemCount() {
    let count = 0;
    for (let i = 0; i < this.items.length; i++) {
      count += this.items[i].quantity;
    }
    return count;
  }

  clear() {
    this.items = [];
    this.discountCode = null;
  }

  getSummary() {
    return {
      items: this.items.map(function(item) {
        return {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          lineTotal: Math.round(item.price * item.quantity * 100) / 100
        };
      }),
      itemCount: this.getItemCount(),
      subtotal: this.getSubtotal(),
      discount: this.getDiscountAmount(),
      tax: this.getTax(),
      total: this.getTotal()
    };
  }
}

module.exports = ShoppingCart;
