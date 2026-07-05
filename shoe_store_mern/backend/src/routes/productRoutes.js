const express = require('express');
const router = express.Router();
const { listProducts, featuredProducts, getProduct } = require('../controllers/productController');

router.get('/featured', featuredProducts);
router.get('/:id', getProduct);
router.get('/', listProducts);

module.exports = router;
