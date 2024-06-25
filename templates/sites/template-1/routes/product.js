const express = require("express");
const { productController } = require("../controllers/product.js");
const auth = require("../../../../src/middleware/authAdmin.js");

const createProductRouter = (Product) => {
    const productRouter = express.Router();

    productRouter.get("", productController.getProducts(Product));

    productRouter.post("", auth, productController.addProduct(Product));

    return productRouter;
};

module.exports = { createProductRouter };
