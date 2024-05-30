const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, '../../data/carrito.json');

function getCarts() {
    try {
        const jsonData = fs.readFileSync(cartsFilePath);
        return JSON.parse(jsonData);
    } catch (error) {
        throw new Error('Failed to read carts data');
    }
}

function saveCarts(carts) {
    try {
        const stringifyData = JSON.stringify(carts, null, 2);
        fs.writeFileSync(cartsFilePath, stringifyData);
    } catch (error) {
        throw new Error('Failed to save carts data');
    }
}

function createCart(req, res) {
    try {
        const newCart = {
            id: Date.now(),
            items: [],
            total: 0
        };
        const carts = getCarts();
        carts.push(newCart);
        saveCarts(carts);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function getCartById(req, res) {
    try {
        const { cid } = req.params;
        const carts = getCarts();
        const cart = carts.find(c => c.id === parseInt(cid));
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function addProductToCart(req, res) {
    try {
        const { cid, pid } = req.params;
        const quantity = parseInt(req.body.quantity) || 1;
        if (quantity < 1) {
            return res.status(400).json({ message: 'Cantidad no válida.' });
        }
        const carts = getCarts();
        const products = getProducts();  // Asegúrate de que getProducts esté disponible globalmente o importado
        const cart = carts.find(c => c.id === parseInt(cid));
        const product = products.find(p => p.id === parseInt(pid));

        if (!cart) {
            res.status(404).send('Carrito no encontrado');
        } else if (!product) {
            res.status(404).send('Producto no encontrado');
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId === pid);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId: pid, quantity });
            }
            saveCarts(carts);
            res.json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createCart,
    getCartById,
    addProductToCart
};
