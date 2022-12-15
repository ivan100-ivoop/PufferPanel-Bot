const { join } = require('path');
const { readdirSync } = require("fs");

const dir = join(__dirname, "../handlers/");

module.exports = (client) => {
    const command = readdirSync(dir).filter(files => files.endsWith(".js"));
    for (const file of command) {
        require(join(dir, file))(client);
    }
}