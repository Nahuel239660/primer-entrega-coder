const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../../data/productos.json');

// Helper function to read products from JSON file
function getProducts() {
    const jsonData = fs.readFileSync(productsFilePath);
    return JSON.parse(jsonData);
}

// Helper function to save products to JSON file
function saveProducts(products) {
    const stringifyData = JSON.stringify(products, null, 2);
    fs.writeFileSync(productsFilePath, stringifyData);
}

// Get all products
function getAllProducts(req, res) {
    const products = getProducts();
    res.json(products);
}

// Get a single product by id
function getProductById(req, res) {
    const { pid } = req.params;
    const products = getProducts();
    const product = products.find(p => p.id === parseInt(pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
}

// Create a new product
function createProduct(req, res) {
    const newProduct = req.body;
    const products = getProducts();
    newProduct.id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
}

// Update an existing product
function updateProduct(req, res) {
    const { pid } = req.params;
    const products = getProducts();
    const index = products.findIndex(p => p.id === parseInt(pid));
    if (index !== -1) {
        const updatedProduct = { ...products[index], ...req.body };
        products[index] = updatedProduct;
        saveProducts(products);
        res.json(updatedProduct);
    } else {
        res.status(404).send('Producto no encontrado');
    }
}

// Delete a product
function deleteProduct(req, res) {
    const { pid } = req.params;
    const products = getProducts();
    const filteredProducts = products.filter(p => p.id !== parseInt(pid));
    if (products.length !== filteredProducts.length) {
        saveProducts(filteredProducts);
        res.send(`Producto con ID ${pid} ha sido eliminado`);
    } else {
        res.status(404).send('Producto no encontrado');
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
