const express = require('express');
const router = express.Router();
const { placeOrder, getOrder, myOrders } = require('../controllers/orderController');
const { protectCustomer, optionalCustomer } = require('../middleware/auth');

router.post('/', optionalCustomer, placeOrder);
router.get('/mine', protectCustomer, myOrders);
router.get('/:id', getOrder);

module.exports = router;
