const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, '../../data/carrito.json');

function getCarts() {
    const jsonData = fs.readFileSync(cartsFilePath);
    return JSON.parse(jsonData);
}

function saveCarts(carts) {
    const stringifyData = JSON.stringify(carts, null, 2);
    fs.writeFileSync(cartsFilePath, stringifyData);
}
// Create a new cart
function createCart(req, res) {
    const newCart = { 
        id: Date.now(),  
        items: [], 
        total: 0 
    };
    const carts = getCarts();
    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
}

// Get a cart by id
function getCartById(req, res) {
    const { cid } = req.params;
    const carts = getCarts();
    const cart = carts.find(c => c.id === parseInt(cid));
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
}

// Add a product to a cart
function addProductToCart(req, res) {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;  // Default to 1 if no quantity provided
    const carts = getCarts();
    const products = getProducts();  // Assuming getProducts() is available from the products controller
    const cart = carts.find(c => c.id === parseInt(cid));
    const product = products.find(p => p.id === parseInt(pid));
    
    if (cart && product) {
        const itemIndex = cart.items.findIndex(item => item.productId === pid);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity; // Increase the quantity
        } else {
            cart.items.push({ productId: pid, quantity }); // Add new item
        }
        saveCarts(carts);
        res.json(cart);
    } else {
        if (!cart) {
            res.status(404).send('Carrito no encontrado');
        } else {
            res.status(404).send('Producto no encontrado');
        }
    }
}
module.exports = {
    createCart,
    getCartById,
    addProductToCart
};
