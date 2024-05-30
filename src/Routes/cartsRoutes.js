const express = require('express');
const router = express.Router();
const {
    getCartItems,
    addProductToCart
} = require('../Controllers/cartsController');

router.get('/', getCartItems);
router.post('/product/:pid', addProductToCart);

module.exports = router;
