const express = require("express");
const Website = require("../models/website");
const authAdmin = require("../middleware/authAdmin");
const authMain = require("../middleware/auth");

const router = new express.Router();

router.post("/admins", authMain, async (req, res) => {
    const user = req.user;
    const website = await Website.findOne({ owner: user._id });

    website.admins.push({
        email: req.body.email,
        password: req.body.password,
    });
    try {
        await website.save();
        res.status(201).send({ website });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/admins/login", async (req, res) => {
    try {
        const admin = await Website.findByCredentials(
            req.body.subdomain,
            req.body.email,
            req.body.password
        );

        const website = await Website.findOne({
            subdomain: req.body.subdomain,
        });

        const token = await website.generateAuthToken(req.body.email);
        res.send({ admin, token });
    } catch (e) {
        res.status(400).send();
    }
});

router.post("/admins/logout", authAdmin, async (req, res) => {
    try {
        const website = req.website;

        website.admins.forEach((admin) => {
            admin.tokens = admin.tokens.filter(
                (token) => token.token !== req.token
            );
        });

        await website.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post("/admins/logoutAll", authAdmin, async (req, res) => {
    try {
        const website = req.website;

        website.admins.forEach((admin) => {
            admin.tokens.forEach((token) => {
                if (token.token === req.token) {
                    admin.tokens = [];
                }
            });
        });
        await website.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/admins/me", authAdmin, async (req, res) => {
    const website = req.website;

    website.admins.forEach((admin) => {
        admin.tokens.forEach((token) => {
            if (token.token === req.token) {
                res.send({ email: admin.email, token: req.token });
            }
        });
    });
});

router.patch("/admins", authMain, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["email", "password"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid update!" });
    }

    if (!req.body.email) {
        return res.status(400).send({ error: "Email is required!" });
    }

    try {
        const website = await Website.findOne({ owner: req.user._id });
        let admin = null;
        website.admins.forEach((adm) => {
            if (adm.email === req.body.email) {
                updates.forEach((update) => (adm[update] = req.body[update]));
                return (admin = adm);
            }
        });

        await website.save();
        res.send({ email: admin.email, token: req.token });
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
