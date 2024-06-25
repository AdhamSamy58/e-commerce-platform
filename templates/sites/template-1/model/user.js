// orderModel.js
const { userSchema } = require("../schema/user");

function createUserModel(dbConnection) {
    return dbConnection.model("User", userSchema);
}

module.exports = { createUserModel };
