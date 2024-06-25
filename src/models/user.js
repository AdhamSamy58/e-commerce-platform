const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Website = require("./website");
const dropDatabase = require("../utils/dropDatabase");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
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
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error("Age must be positive number!");
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
                    throw new Error("Can't contain 'password' as a password");
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
        avatar: {
            type: Buffer,
        },
    },
    {
        timestamps: true,
    }
);
userSchema.virtual("websites", {
    ref: "Website",
    localField: "_id",
    foreignField: "owner",
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET
    );
    user.tokens = user.tokens.concat({ token });
    await user.save();
    const website = await Website.findOne({ owner: user._id });

    website.admins.forEach((admin) => {
        if (admin.email === user.email) {
            admin.tokens.push({ token });
        }
    });

    await website.save();

    return token;
};

//remove token from and website
userSchema.methods.removeAuthToken = async function (token = "") {
    const user = this;
    const website = await Website.findOne({ owner: user._id });

    if (token === "") {
        website.admins.forEach((admin) => {
            if (admin.email === user.email) {
                admin.tokens = [];
            }
        });
        await website.save();
        return;
    }

    website.admins.forEach((admin) => {
        if (admin.email === user.email) {
            admin.tokens = admin.tokens.filter((adminToken) => {
                return adminToken.token !== token;
            });
        }
    });

    await website.save();

    return token;
};

userSchema.methods.updateWebsite = async function (data) {
    const user = this;
    const website = await Website.findOne({ owner: user._id });
    if (data.subdomain) {
        website.subdomain = data.subdomain;
    }
    if (data.password || data.email) {
        website.admins.forEach((admin) => {
            if (admin.email === user.email) {
                if (data.password) {
                    admin.password = data.password;
                }
                if (data.email) {
                    admin.email = data.email;
                }
            }
        });
    }
    await website.save();

    return data;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return user;
};

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Delete user tasks when user is removed
userSchema.pre("deleteOne", { document: true }, async function (next) {
    const user = this;
    const websites = await Website.find({ owner: user._id });
    await dropDatabase(websites);
    await Website.deleteOne({ owner: user._id });
    next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
