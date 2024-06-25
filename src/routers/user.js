const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const Website = require("../models/website");
const auth = require("../middleware/auth");
const {
    sendWelcomeEmail,
    sendCancelEmail,
    sendContactEmail,
} = require("../emails/account");

const router = new express.Router();

router.post("/users", async (req, res) => {
    const user = new User(req.body);
    const subdomain = req.body.subdomain;
    const website = new Website({
        subdomain: subdomain,
        owner: user._id,
        admins: [
            {
                email: user.email,
                password: user.password,
            },
        ],
    });

    const validate = await Website.findOne({
        subdomain: subdomain,
    });

    if (validate) {
        return res
            .status(400)
            .send("Subdomain is taken please try another one");
    }

    try {
        await user.save();
        await website.save();

        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});

router.post("/contact", async (req, res) => {
    try {
        const contact = req.body;
        if (
            !contact.email ||
            !contact.firstName ||
            !contact.lastName ||
            !contact.message ||
            !contact.mobile
        ) {
            return res.status(400).send("Please fill all the fields");
        }
        if (contact.mobile.length < 11) {
            return res
                .status(400)
                .send("Mobile number should be at least 11 characters");
        }
        sendContactEmail(
            contact.email,
            contact.firstName + contact.lastName,
            contact.message,
            contact.mobile
        );
        res.send("Email has been sent successfully");
    } catch (e) {
        res.status(400).send();
    }
});

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.removeAuthToken(req.token);
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        await req.user.removeAuthToken();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age", "subdomain"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid update!" });
    }

    try {
        await req.user.updateWebsite(req.body);

        delete req.body.subdomain;
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.deleteOne();
        sendCancelEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            cb(new Error("Please upload an image"));
        }
        cb(undefined, true);
    },
});

router.post(
    "/users/me/avatar",
    auth,
    upload.single("avatar"),
    async (req, res) => {
        const buffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();

        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    },
    (error, req, res) => {
        res.status(400).send({ error: error.message });
    }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set("Content-Type", "image/png").send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;
