const fs = require('fs');
const path = require('path');

const cartFilePath = path.join(__dirname, '../../data/carrito.json');

function getCart() {
    try {
        const jsonData = fs.readFileSync(cartFilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error al leer los datos del carrito:', error);
        return { id: 1, items: [] };
    }
}

function saveCart(cart) {
    try {
        const jsonData = JSON.stringify(cart, null, 2);
        fs.writeFileSync(cartFilePath, jsonData);
    } catch (error) {
        console.error('Error al guardar los datos del carrito:', error);
    }
}

function getCartItems(req, res) {
    const cart = getCart();
    res.json(cart.items);
}

function addProductToCart(req, res) {
    const productId = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity) || 1;

    const products = getProducts(); // Asegúrate de importar esta función o definirla
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const cart = getCart();
    const existingProduct = cart.items.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.items.push({ id: productId, name: product.name, quantity });
    }

    saveCart(cart);
    res.json(cart);
}

module.exports = {
    getCartItems,
    addProductToCart
};
