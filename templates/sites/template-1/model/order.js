// orderModel.js
const { orderSchema } = require("../schema/order");

function createOrderModel(dbConnection) {
    return dbConnection.model("Order", orderSchema);
}

module.exports = { createOrderModel };
