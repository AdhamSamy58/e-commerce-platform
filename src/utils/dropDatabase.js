const mongoose = require("mongoose");

async function dropDatabase(websites) {
    try {
        for (const website of websites) {
            const subdomain = website.subdomain;
            const dbName = `subdomain_${subdomain}`;

            // Get the existing Mongoose connection associated with the subdomain's database
            const connection = mongoose.connection.useDb(dbName);

            await connection.dropDatabase();

            console.log(`Database '${dbName}' dropped successfully`);
        }
    } catch (error) {
        console.error("Error dropping database:", error);
    }
}

module.exports = dropDatabase;
