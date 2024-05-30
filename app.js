const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const productsRouter = require('./src/Routes/productsRoutes');
const cartsRouter = require('./src/Routes/cartsRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    const products = getProducts();
    res.render('home', { products });
});

app.get('/addProduct', (req, res) => {
    res.render('addProduct', { title: 'Agregar Producto' });
});

app.get('/addCart', (req, res) => {
    const products = getProducts();
    res.render('addCart', { title: 'Agregar Carrito', products });
});

app.get('/viewCart', (req, res) => {
    const cart = getCart();
    res.render('viewCart', { title: 'Ver Carrito', items: cart.items });
});

app.post('/cart/product/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const cart = getCart();
    const existingProduct = cart.items.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.items.push({ id: productId, name: product.name, quantity: 1 });
    }

    saveCart(cart);
    res.json({ message: 'Producto agregado al carrito', cart });
});

server.listen(8080, () => {
    console.log('Servidor ejecutándose en http://localhost:8080');
});

function getProducts() {
    try {
        const jsonData = fs.readFileSync(path.join(__dirname, 'data/productos.json'), 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error al leer los datos de productos:', error);
        return [];
    }
}

function getCart() {
    try {
        const jsonData = fs.readFileSync(path.join(__dirname, 'data/carrito.json'), 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error al leer los datos del carrito:', error);
        return { id: 1, items: [] };
    }
}

function saveCart(cart) {
    try {
        const jsonData = JSON.stringify(cart, null, 2);
        fs.writeFileSync(path.join(__dirname, 'data/carrito.json'), jsonData);
    } catch (error) {
        console.error('Error al guardar los datos del carrito:', error);
    }
}
