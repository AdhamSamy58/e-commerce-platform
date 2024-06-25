const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = (User) => (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
        });
        user.save()
            .then((authUser) => {
                const token = jwt.sign(
                    { email: authUser.email, userId: authUser._id },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );
                res.status(200).json({
                    message: "Success",
                    token: token,
                    expiresIn: 3600,
                    userId: authUser._id,
                    name: authUser.name,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Invalid Authentication Credentials!",
                    error: err,
                });
            });
    });
};

const loginUser = (User) => async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (!user) {
            res.status(401).json({
                message: "Invalid Authentication Credentials!",
            });
            return; // Exit the function early if user does not exist
        }

        const result = await bcrypt.compare(req.body.password, user.password);

        if (!result) {
            res.status(401).json({
                message: "Invalid Authentication Credentials!",
            });
            return; // Exit the function early if password is incorrect
        }

        const token = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Success",
            token: token,
            expiresIn: 3600,
            userId: user._id,
            name: user.name,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

module.exports = { userController: { createUser, loginUser } };
