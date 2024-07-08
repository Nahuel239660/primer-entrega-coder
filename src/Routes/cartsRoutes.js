const express = require('express');
const router = express.Router();
const {
    getCartItems,
    addProductToCart,
    deleteProductFromCart,
    updateCart,
    updateProductQuantity,
    deleteAllProductsFromCart
} = require('../controllers/cartsController');

router.get('/:cid', getCartItems);
router.post('/:cid/products/:pid', addProductToCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', deleteAllProductsFromCart);

module.exports = router;
