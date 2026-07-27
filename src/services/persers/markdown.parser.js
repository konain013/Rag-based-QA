const fs = require("fs/promises");

const {
    validateText,
    handleParserError,
} = require("./parser.utility");

const { cleanText } = require("../../utils/cleanText");

const parse = async (filePath) => {
    try {
        const text = await fs.readFile(filePath, "utf8");

        const cleanedText = cleanText(text);

        validateText(cleanedText);

        return {
            text: cleanedText,
        };
    } catch (error) {
        handleParserError(error, "Markdown");
    }
};

module.exports = {
    parse,
};