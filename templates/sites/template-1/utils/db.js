const { subdomain } = require("../index.js");
const getDB = () => {
    return `subdomain_${subdomain}`;
};

module.exports = { getDB };
