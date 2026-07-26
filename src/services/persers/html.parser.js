const fs = require("fs/promises");
const cheerio = require("cheerio");

const {
    validateText,
    handleParserError,
} = require("./parser.utility");

const parse = async (filePath) => {
    try {
        const html = await fs.readFile(filePath, "utf8");

        const $ = cheerio.load(html);

        return {
            text: validateText($("body").text(), "HTML"),
        };
    } catch (error) {
        handleParserError(error, "HTML");
    }
};

module.exports = {
    parse,
};