const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const {
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} = require('../controllers/productController');

const {
  adminListCategories,
  adminCreateCategory,
  adminDeleteCategory,
} = require('../controllers/categoryController');

const {
  adminListOrders,
  adminGetOrder,
  adminUpdateOrderStatus,
} = require('../controllers/orderController');

const { adminListMessages } = require('../controllers/contactController');
const { dashboardStats } = require('../controllers/adminController');
const { adminListCustomers } = require('../controllers/customerController');

router.use(protectAdmin);

// Dashboard
router.get('/dashboard', dashboardStats);

// Products
router.get('/products', adminListProducts);
router.post('/products', upload.single('image'), adminCreateProduct);
router.put('/products/:id', upload.single('image'), adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

// Categories
router.get('/categories', adminListCategories);
router.post('/categories', adminCreateCategory);
router.delete('/categories/:id', adminDeleteCategory);

// Orders
router.get('/orders', adminListOrders);
router.get('/orders/:id', adminGetOrder);
router.patch('/orders/:id/status', adminUpdateOrderStatus);

// Messages
router.get('/messages', adminListMessages);

// Customers
router.get('/customers', adminListCustomers);

module.exports = router;
