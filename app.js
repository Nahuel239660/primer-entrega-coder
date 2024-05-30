const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const { Server } = require("socket.io");
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

app.use('/products', productsRouter);
app.use('/carts', cartsRouter);

app.get('/', (req, res) => {
    const products = getProducts();
    res.render('home', { products });
});

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('updateProducts', () => {
        const products = getProducts();
        io.emit('productsUpdated', products);
    });

    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });
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
