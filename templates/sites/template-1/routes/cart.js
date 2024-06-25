const express = require("express");
const { cartController } = require("../controllers/cart.js");
const { checkAuth } = require("../middleware/check-auth.js");

const createCartRouter = (Cart) => {
    const cartRouter = express.Router();

    cartRouter.get("", checkAuth, cartController.getCart(Cart));

    cartRouter.post("", checkAuth, cartController.addCartItem(Cart));

    cartRouter.put("/:id", checkAuth, cartController.editCartItem(Cart));

    cartRouter.delete("/:id", checkAuth, cartController.deleteCartItem(Cart));

    cartRouter.delete("", checkAuth, cartController.deleteCart(Cart));

    return cartRouter;
};

module.exports = { createCartRouter };
