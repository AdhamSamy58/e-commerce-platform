const Website = require("../models/website");

const fetchWebsites = async () => {
    try {
        const websites = await Website.find({});
        return websites;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
};

module.exports = { fetchWebsites };
