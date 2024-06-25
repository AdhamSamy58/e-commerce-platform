const express = require("express");
const { userController } = require("../controllers/user.js");

function createUserRouter(User) {
    const userRouter = express.Router();

    userRouter.post("/signup", userController.createUser(User));

    userRouter.post("/login", userController.loginUser(User));

    return userRouter;
}

module.exports = { createUserRouter };
