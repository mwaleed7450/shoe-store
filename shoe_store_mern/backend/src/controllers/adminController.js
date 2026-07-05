const Product = require('../models/Product');
const Order = require('../models/Order');

// GET /api/admin/dashboard
async function dashboardStats(req, res) {
  try {
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const lowStock = await Product.countDocuments({ stock: { $lte: 5 } });

    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const revenue = revenueAgg[0]?.total || 0;

    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);

    return res.json({
      success: true,
      stats: { totalProducts, totalOrders, pendingOrders, lowStock, revenue },
      recentOrders,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error fetching dashboard stats.' });
  }
}

module.exports = { dashboardStats };
