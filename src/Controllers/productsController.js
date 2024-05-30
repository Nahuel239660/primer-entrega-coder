const fs = require('fs');
const path = require('path');
const Joi = require('joi');  // Asegúrate de instalar Joi con 'npm install joi'

const productsFilePath = path.join(__dirname, '../../data/productos.json');

const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    description: Joi.string().optional()
});

function getProducts() {
    try {
        const jsonData = fs.readFileSync(productsFilePath);
        return JSON.parse(jsonData);
    } catch (error) {
        throw new Error('Failed to read products data');
    }
}

function saveProducts(products) {
    try {
        const stringifyData = JSON.stringify(products, null, 2);
        fs.writeFileSync(productsFilePath, stringifyData);
    } catch (error) {
        throw new Error('Failed to save products data');
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
        const { pid } = req.params;
        const products = getProducts();
        const product = products.find(p => p.id === parseInt(pid));
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
    try {
        const { pid } = req.params;
        const { error, value } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: 'Datos inválidos', detail: error.details });
        }
        const products = getProducts();
        const index = products.findIndex(p => p.id === parseInt(pid));
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
        const { pid } = req.params;
        const products = getProducts();
        const filteredProducts = products.filter(p => p.id !== parseInt(pid));
        if (products.length !== filteredProducts.length) {
            saveProducts(filteredProducts);
            res.send(`Producto con ID ${pid} ha sido eliminado`);
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
