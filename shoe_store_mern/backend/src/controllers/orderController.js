const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders  (public, optional customer auth)
// body: { name, phone, email, address, paymentMethod, items: [{ productId, size, quantity }] }
//
// Note: this does NOT use a MongoDB transaction, so it works on a plain
// standalone MongoDB instance (transactions require a replica set). Stock is
// checked and decremented per-item; on a very rare double-submit race this
// could theoretically oversell by 1 unit, which is an acceptable trade-off
// for a small store without replica-set infrastructure.
async function placeOrder(req, res) {
  try {
    const { name, phone, email, address, paymentMethod, items } = req.body;

    if (!name?.trim() || !phone?.trim() || !address?.trim()) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    let total = 0;
    const orderItems = [];
    const stockUpdates = []; // track what we've already decremented, in case we need to roll back

    try {
      for (const item of items) {
        const product = await Product.findOne({ _id: item.productId, status: 'active' });
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        const quantity = Math.max(1, Number(item.quantity) || 1);
        if (product.stock < quantity) {
          throw new Error(`Not enough stock for "${product.name}". Only ${product.stock} left.`);
        }

        const price = product.discountPrice || product.price;
        total += price * quantity;

        orderItems.push({
          product: product._id,
          productName: product.name,
          size: item.size || '',
          price,
          quantity,
        });

        product.stock -= quantity;
        await product.save();
        stockUpdates.push({ productId: product._id, quantity });
      }
    } catch (stockErr) {
      // roll back any stock we already decremented before the failure
      for (const update of stockUpdates) {
        await Product.updateOne({ _id: update.productId }, { $inc: { stock: update.quantity } });
      }
      throw stockErr;
    }

    const paymentMethodValue = paymentMethod === 'bank' ? 'bank' : 'cod';

    const order = await Order.create({
      customer: req.customer ? req.customer._id : null,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerAddress: address.trim(),
      customerEmail: email?.trim() || '',
      items: orderItems,
      totalAmount: total,
      paymentMethod: paymentMethodValue,
      status: 'pending',
    });

    return res.status(201).json({ success: true, orderId: order._id, order });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message || 'Something went wrong placing your order.' });
  }
}

// GET /api/orders/:id  (public - used on order success page)
async function getOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    return res.json({ success: true, order });
  } catch (err) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }
}

// GET /api/orders/mine (protected customer) - order history
async function myOrders(req, res) {
  try {
    const orders = await Order.find({ customer: req.customer._id }).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error fetching orders.' });
  }
}

// ===== Admin =====

// GET /api/admin/orders?status=
async function adminListOrders(req, res) {
  try {
    const { status } = req.query;
    const filter = {};
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (status && validStatuses.includes(status)) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error fetching orders.' });
  }
}

// GET /api/admin/orders/:id
async function adminGetOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    return res.json({ success: true, order });
  } catch (err) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }
}

// PATCH /api/admin/orders/:id/status  { status }
async function adminUpdateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    return res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error updating order.' });
  }
}

module.exports = { placeOrder, getOrder, myOrders, adminListOrders, adminGetOrder, adminUpdateOrderStatus };
