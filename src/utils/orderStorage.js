/**
 * Order & Payment Transaction Storage Engine
 * Keeps track of all orders, manual UTR proofs, verification statuses, and timestamps.
 */

const ORDERS_KEY = 'flipkart_orders_database';

/**
 * Get all saved orders from localStorage
 */
export function getAllOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to get orders:', err);
  }
  return [];
}

/**
 * Save or record a new order
 */
export function recordOrder(order) {
  try {
    const orders = getAllOrders();
    const newOrder = {
      orderId: order.orderId,
      amount: order.amount,
      customerName: order.customerName || 'Customer',
      phone: order.phone || '',
      address: order.address || '',
      items: order.items || [],
      vpaUsed: order.vpaUsed || '',
      paymentMethod: order.paymentMethod || 'UPI',
      status: order.status || 'PAID', // 'PAID' | 'PENDING_VERIFICATION' | 'FAILED'
      utrNumber: order.utrNumber || '',
      proofScreenshot: order.proofScreenshot || null, // Base64 data URL
      createdAt: order.createdAt || new Date().toISOString(),
      verifiedAt: order.verifiedAt || new Date().toISOString()
    };

    // Prepend new order to list
    const updated = [newOrder, ...orders.filter(o => o.orderId !== newOrder.orderId)];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return newOrder;
  } catch (err) {
    console.error('Failed to record order:', err);
    return null;
  }
}

/**
 * Update order status (e.g. from Admin Panel)
 */
export function updateOrderStatus(orderId, newStatus) {
  try {
    const orders = getAllOrders();
    const index = orders.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      orders[index].status = newStatus;
      orders[index].verifiedAt = new Date().toISOString();
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      return orders[index];
    }
  } catch (err) {
    console.error('Failed to update order status:', err);
  }
  return null;
}

/**
 * Delete an order by ID
 */
export function deleteOrder(orderId) {
  try {
    const orders = getAllOrders();
    const filtered = orders.filter(o => o.orderId !== orderId);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete order:', err);
    return false;
  }
}

/**
 * Seed initial sample orders if database is empty
 */
export function seedSampleOrdersIfEmpty() {
  try {
    const current = getAllOrders();
    if (!current || current.length === 0) {
      const sample = [
        {
          orderId: 'RC20261009183042A91D',
          amount: 458,
          customerName: 'Rahul Sharma',
          phone: '9876543210',
          address: 'Flat 402, Green Heights, Vesu, Surat - 395007',
          items: [{ title: 'Jumpink Sneakers For Women', price: 448, quantity: 1 }],
          vpaUsed: 'flipkart.pay@icici',
          paymentMethod: 'PhonePe UPI',
          status: 'PAID',
          utrNumber: '428491827401',
          proofScreenshot: null,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          verifiedAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          orderId: 'RC20261009141520F32E',
          amount: 1299,
          customerName: 'Priya Patel',
          phone: '9825012345',
          address: 'B-12, Nilkanth Society, Satellite, Ahmedabad - 380015',
          items: [{ title: 'Apple 2025 iPad (A16) 128 GB ROM', price: 1299, quantity: 1 }],
          vpaUsed: 'flipkart.pay@icici',
          paymentMethod: 'Google Pay UPI',
          status: 'PENDING_VERIFICATION',
          utrNumber: '519283746192',
          proofScreenshot: null,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          verifiedAt: null
        }
      ];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(sample));
    }
  } catch (err) {}
}
