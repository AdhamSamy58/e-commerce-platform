const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, required: true, default: 1 },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = { cartSchema };
