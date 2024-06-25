const express = require("express");
const bodyParser = require("body-parser");

const { createUserRouter } = require("./routes/user.js");
const { createPaymentRouter } = require("./routes/pay.js");
const { createCartRouter } = require("./routes/cart.js");
const { createOrderRouter } = require("./routes/order.js");
const { createProductRouter } = require("./routes/product.js");

function createSubDomainWebsiteRouter(Cart, Order, Product, User) {
    const subDomainWebsiteRouter = express.Router();

    subDomainWebsiteRouter.use(bodyParser.json());
    subDomainWebsiteRouter.use(bodyParser.urlencoded({ extended: false }));

    // CORS middleware
    subDomainWebsiteRouter.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Content-Type-Options, Access-Control-Allow-Origin"
        );
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, DELETE, OPTIONS, PUT"
        );
        next();
    });

    subDomainWebsiteRouter.get("/test", (req, res) => {
        res.send("test");
    });

    // Mounting route handlers using the provided parameters
    subDomainWebsiteRouter.use("/api/user", createUserRouter(User));
    subDomainWebsiteRouter.use("/api/product", createProductRouter(Product));
    subDomainWebsiteRouter.use("/api/cart", createCartRouter(Cart));
    subDomainWebsiteRouter.use("/api/order", createOrderRouter(Order));
    subDomainWebsiteRouter.use(
        "/api/payment",
        createPaymentRouter(Cart, Order, User)
    );

    return subDomainWebsiteRouter;
}

module.exports = { createSubDomainWebsiteRouter };
