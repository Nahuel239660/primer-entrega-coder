const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
});

const cartSchema = new Schema({
    items: [cartItemSchema]
});

module.exports = mongoose.model('Cart', cartSchema);
