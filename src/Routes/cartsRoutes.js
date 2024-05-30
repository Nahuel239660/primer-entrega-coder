const express = require('express');
const router = express.Router();
const {
    createCart,
    getCartById,
    addProductToCart
} = require('../Controllers/cartsController.js');

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);

module.exports = router;
