const Product = require('../models/product');
const Joi = require('joi');

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

async function getAllProducts(req, res) {
    const { limit = 10, page = 1, sort, query } = req.query;
    try {
        const options = {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };
        const filter = query ? { category: query } : {};
        const products = await Product.find(filter, null, options);
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / parseInt(limit));
        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? parseInt(page) + 1 : null,
            page: parseInt(page),
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${parseInt(page) + 1}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        res.status(500).json({ error: 'Error al obtener todos los productos' });
    }
}

async function getProductById(req, res) {
    const productId = req.params.pid;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}

async function createProduct(req, res) {
    if (typeof req.body.thumbnails === 'string') {
        req.body.thumbnails = [req.body.thumbnails];
    }

    const { error, value } = productSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Datos inválidos', detail: error.details });
    }
    try {
        const newProduct = new Product(value);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
}

async function updateProduct(req, res) {
    if (typeof req.body.thumbnails === 'string') {
        req.body.thumbnails = [req.body.thumbnails];
    }

    const productId = req.params.pid;
    const { error, value } = productSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Datos inválidos', detail: error.details });
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, value, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}

async function deleteProduct(req, res) {
    const productId = req.params.pid;
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
