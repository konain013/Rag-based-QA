const fs = require("fs/promises");
const cheerio = require("cheerio");

const {
    validateText,
    handleParserError,
} = require("./parser.utility");

const { cleanText } = require("../../utils/cleanText");

const parse = async (filePath) => {
    try {
        const html = await fs.readFile(filePath, "utf8");

        const $ = cheerio.load(html);

        const text = $("body").text();

        const cleanedText = cleanText(text);

        validateText(cleanedText);

        return {
            text: cleanedText,
        };
    } catch (error) {
        handleParserError(error, "HTML");
    }
};

module.exports = {
    parse,
};