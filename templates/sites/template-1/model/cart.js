const { cartSchema } = require("../schema/cart");

function createCartModel(dbConnection) {
    return dbConnection.model("Cart", cartSchema);
}

module.exports = { createCartModel };
