const express = require("express");
require("./db/mongoose");
const mongoose = require("mongoose");
const vhost = require("vhost");
const path = require("path");

const { fetchWebsites } = require("./utils/websitesList");
const userRouter = require("./routers/user");
const websiteRouter = require("./routers/website");
const {
    createSubDomainWebsiteRouter,
} = require("../templates/sites/template-1/index.js");

const app = express();

let subdomains = [];
let subdomainApps = [];
let subdomainConnections = {};

// Function to update websites array
async function updateWebsites(createSubdomainApps) {
    try {
        subdomainApps = [];
        const websites = await fetchWebsites();
        subdomains = websites.map((website) => website.subdomain);
        await createSubdomainApps();
        console.log("Websites updated", subdomains.length);
    } catch (error) {
        console.log("Error fetching websites:", error);
    }
}

async function createSubdomainApps() {
    for (const subdomain of subdomains) {
        const subApp = express();
        if (!subdomainConnections[subdomain]) {
            const dbConnection = await createDBConnection(subdomain);
            subApp.set("dbConnection", dbConnection);

            const {
                createCartModel,
            } = require("../templates/sites/template-1/model/cart.js");
            const {
                createOrderModel,
            } = require("../templates/sites/template-1/model/order.js");
            const {
                createProductModel,
            } = require("../templates/sites/template-1/model/product.js");
            const {
                createUserModel,
            } = require("../templates/sites/template-1/model/user.js");
            const Cart = createCartModel(dbConnection);
            const Order = createOrderModel(dbConnection);
            const Product = createProductModel(dbConnection);
            const User = createUserModel(dbConnection);

            subApp.set("Cart", Cart);
            subApp.set("Order", Order);
            subApp.set("Product", Product);
            subApp.set("User", User);
        } else {
            const dbConnection = subdomainConnections[subdomain];
            subApp.set("dbConnection", dbConnection);
        }
        const User = subApp.get("User");
        const Cart = subApp.get("Cart");
        const Order = subApp.get("Order");
        const Product = subApp.get("Product");

        subApp.use(
            "/",
            express.static(path.join(__dirname, "/temp/dist/agri-fresh"))
        );

        subApp.use(
            "",
            createSubDomainWebsiteRouter(Cart, Order, Product, User)
        );
        subdomainApps.push(subApp);
    }

    let index = 0;
    for (const subdomain of subdomains) {
        app.use(vhost(`${subdomain}.localhost`, subdomainApps[index]));
        index++;
    }
    console.log("Subdomain apps created", subdomainApps.length);
}

async function createDBConnection(subdomain) {
    const connection = await mongoose.createConnection(
        process.env.MONGODB_URI,
        {
            dbName: `subdomain_${subdomain}`,
        }
    );
    subdomainConnections[subdomain] = connection;
    return connection;
}

updateWebsites(createSubdomainApps);
setInterval(updateWebsites, 10000, createSubdomainApps);

app.use(express.json());
app.use(userRouter);
app.use(websiteRouter);

module.exports = app;
