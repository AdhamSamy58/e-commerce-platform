// orderModel.js
const { productSchema } = require("../schema/product");

function createProductModel(dbConnection) {
    return dbConnection.model("Product", productSchema);
}

module.exports = { createProductModel };
