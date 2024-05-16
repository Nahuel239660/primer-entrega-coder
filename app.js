const express = require('express');
const app = express();
const productsRouter = require('./api/products/productsRoutes');
const cartsRouter = require('./api/carts/cartsroutes');

app.use(express.json());  // Para parsear el cuerpo de las solicitudes JSON

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => {
    console.log('Servidor ejecutándose en http://localhost:8080');
});
