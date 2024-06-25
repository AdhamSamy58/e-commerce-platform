const express = require("express");
const { orderController } = require("../controllers/order.js");
const { checkAuth } = require("../middleware/check-auth.js");

const createOrderRouter = (Order) => {
    const orderRouter = express.Router();

    orderRouter.get("", checkAuth, orderController.getOrders(Order));

    return orderRouter;
};

module.exports = { createOrderRouter };
