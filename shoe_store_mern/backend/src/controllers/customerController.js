const Customer = require('../models/Customer');
const Order = require('../models/Order');

// GET /api/admin/customers
async function adminListCustomers(req, res) {
  try {
    const customers = await Customer.find({}).select('-password -otp -otpExpires').sort({ createdAt: -1 }).lean();

    const withOrderCounts = await Promise.all(
      customers.map(async (c) => {
        const orderCount = await Order.countDocuments({ customer: c._id });
        const totalSpentAgg = await Order.aggregate([
          { $match: { customer: c._id, status: { $ne: 'cancelled' } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        return { ...c, orderCount, totalSpent: totalSpentAgg[0]?.total || 0 };
      })
    );

    return res.json({ success: true, customers: withOrderCounts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error fetching customers.' });
  }
}

module.exports = { adminListCustomers };
