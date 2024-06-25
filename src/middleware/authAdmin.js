const jwt = require("jsonwebtoken");
const Website = require("../models/website");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const website = await Website.findOne({
            _id: decoded._id,
            "admins.tokens.token": token,
        });

        if (!website) {
            throw new Error();
        }

        req.token = token;
        req.website = website;

        next();
    } catch (e) {
        res.status(401).send({ error: "Please authenticate!" });
    }
};

module.exports = auth;
