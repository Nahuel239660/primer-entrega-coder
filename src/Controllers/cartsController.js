const Cart = require('../models/cart');
const Product = require('../models/product');

async function getCartItems(req, res) {
    try {
        const cart = await Cart.findById(req.params.cid).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(cart.items);
    } catch (error) {
        console.error('Error al obtener los items del carrito:', error);
        res.status(500).json({ error: 'Error al obtener los items del carrito' });
    }
}

async function addProductToCart(req, res) {
    const productId = req.params.pid;
    const quantity = parseInt(req.body.quantity) || 1;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        let cart = await Cart.findById(req.params.cid);
        if (!cart) {
            cart = new Cart({ items: [] });
        }
        const existingProduct = cart.items.find(item => item.product.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
}

async function deleteProductFromCart(req, res) {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        cart.items = cart.items.filter(item => item.product.toString() !== req.params.pid);
        await cart.save();
        res.json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
}

async function updateCart(req, res) {
    try {
        const cart = await Cart.findByIdAndUpdate(req.params.cid, { items: req.body.items }, { new: true });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
}

async function updateProductQuantity(req, res) {
    const productId = req.params.pid;
    const quantity = parseInt(req.body.quantity);
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        const productInCart = cart.items.find(item => item.product.toString() === productId);
        if (!productInCart) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }
        productInCart.quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto:', error);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto' });
    }
}

async function deleteAllProductsFromCart(req, res) {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        cart.items = [];
        await cart.save();
        res.json({ message: 'Todos los productos eliminados del carrito', cart });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
    }
}

module.exports = {
    getCartItems,
    addProductToCart,
    deleteProductFromCart,
    updateCart,
    updateProductQuantity,
    deleteAllProductsFromCart
};
