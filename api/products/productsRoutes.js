const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('./productsController'); // Asegúrate de que el nombre del archivo sea correcto

router.get('/', getAllProducts);
router.get('/:pid', getProductById);
router.post('/', createProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

module.exports = router;
