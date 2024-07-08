const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const productsRouter = require('./src/routes/productsRoutes');
const cartsRouter = require('./src/routes/cartsRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const connectDB = require('./config/database');
connectDB();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.render('home', { title: 'Inicio' });
});

app.get('/addProduct', (req, res) => {
    res.render('addProduct', { title: 'Agregar Producto' });
});

app.get('/addCart', (req, res) => {
    res.render('addCart', { title: 'Agregar Carrito' });
});

app.get('/viewCart', (req, res) => {
    res.render('viewCart', { title: 'Ver Carrito' });
});

server.listen(8080, () => {
    console.log('Servidor ejecutándose en http://localhost:8080');
});
