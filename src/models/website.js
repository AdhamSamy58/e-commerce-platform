const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const websiteSchema = new mongoose.Schema(
    {
        subdomain: { type: String, unique: true, required: true, trim: true },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        admins: [
            {
                email: {
                    type: String,
                    required: true,
                    unique: true,
                    trim: true,
                    lowercase: true,
                    validate(value) {
                        if (!validator.isEmail(value)) {
                            throw new Error("Invalid Email Address!");
                        }
                    },
                },
                password: {
                    type: String,
                    required: true,
                    minlength: 7,
                    trim: true,
                    validate(value) {
                        if (value.toLowerCase().includes("password")) {
                            throw new Error(
                                "Can't contain 'password' as a password"
                            );
                        }
                    },
                },
                tokens: [
                    {
                        token: {
                            type: String,
                            required: true,
                        },
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

websiteSchema.methods.toJSON = function () {
    const website = this;
    const websiteObject = website.toObject();

    delete websiteObject.admins.password;
    delete websiteObject.admins.tokens;

    return websiteObject;
};

websiteSchema.methods.generateAuthToken = async function (adminEmail) {
    const website = this;
    const token = jwt.sign(
        { _id: website._id.toString() },
        process.env.JWT_SECRET
    );
    for (const admin of website.admins) {
        if (admin.email == adminEmail) {
            admin.tokens.push({ token });
        }
    }

    await website.save();
    return token;
};

websiteSchema.statics.findByCredentials = async (
    subdomain,
    email,
    password
) => {
    const website = await Website.findOne({ subdomain });

    if (!website) {
        throw new Error("Unable to login: No website found");
    }

    for (const admin of website.admins) {
        if (admin.email == email) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                throw new Error("Unable to login: Incorrect password");
            }
            return admin.email;
        }
    }
};

// Hash the plain text password before saving
websiteSchema.pre("save", async function (next) {
    const website = this;

    for (let i = 0; i < website.admins.length; i++) {
        const admin = website.admins[i];

        // Check if password is modified for this admin
        if (admin.isModified("password")) {
            admin.password = await bcrypt.hash(admin.password, 8);
        }
    }

    next();
});

// Delete website tasks when user is removed
websiteSchema.pre("deleteOne", { document: true }, async function (next) {
    next();
});

const Website = mongoose.model("Website", websiteSchema);

module.exports = Website;
