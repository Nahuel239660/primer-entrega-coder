const fs = require('fs');
const path = require('path');
const Joi = require('joi');  // Asegúrate de instalar Joi con 'npm install joi'

const productsFilePath = path.join(__dirname, '../../data/productos.json');

const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    description: Joi.string().optional(),
    code: Joi.string().required(),
    status: Joi.boolean().default(true),
    stock: Joi.number().integer().min(0).required(),
    category: Joi.string().required(),
    thumbnails: Joi.array().items(Joi.string()).optional()
});

function getProducts() {
    try {
        const jsonData = fs.readFileSync(productsFilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error al leer los datos de productos:', error);
        return [];
    }
}

function saveProducts(products) {
    try {
        const jsonData = JSON.stringify(products, null, 2);
        fs.writeFileSync(productsFilePath, jsonData);
    } catch (error) {
        console.error('Error al guardar los datos de productos:', error);
    }
}

function getAllProducts(req, res) {
    try {
        const products = getProducts();
        if (!products.length) {
            return res.status(404).json({ message: 'No hay productos disponibles.' });
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function getProductById(req, res) {
    try {
        const productId = parseInt(req.params.pid);
        const products = getProducts();
        const product = products.find(p => p.id === productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function createProduct(req, res) {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Datos inválidos', detail: error.details });
    }
    try {
        const products = getProducts();
        const newProduct = { ...value, id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1 };
        products.push(newProduct);
        saveProducts(products);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function updateProduct(req, res) {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Datos inválidos', detail: error.details });
    }
    try {
        const productId = parseInt(req.params.pid);
        const products = getProducts();
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            const updatedProduct = { ...products[index], ...value };
            products[index] = updatedProduct;
            saveProducts(products);
            res.json(updatedProduct);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function deleteProduct(req, res) {
    try {
        const productId = parseInt(req.params.pid);
        const products = getProducts();
        const filteredProducts = products.filter(p => p.id !== productId);
        if (products.length !== filteredProducts.length) {
            saveProducts(filteredProducts);
            res.send(`Producto con ID ${productId} ha sido eliminado`);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
