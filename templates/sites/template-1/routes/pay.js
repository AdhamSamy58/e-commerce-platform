const express = require("express");
const { payController } = require("../controllers/pay.js");
const { checkAuth } = require("../middleware/check-auth.js");

const createPaymentRouter = (Cart, Order, User) => {
    const paymentRouter = express.Router();

    paymentRouter.get("", checkAuth, payController.payWithStripe(Cart));
    paymentRouter.get(
        "/success",
        payController.paymentSuccess(Cart, Order, User)
    );

    return paymentRouter;
};

module.exports = { createPaymentRouter };
