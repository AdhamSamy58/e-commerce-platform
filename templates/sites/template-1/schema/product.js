const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const productSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    displayQuantity: { type: String, required: true },
    price: { type: Number, required: true },
});

productSchema.plugin(uniqueValidator);

module.exports = { productSchema };
