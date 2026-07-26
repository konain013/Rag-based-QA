const fs = require("fs/promises");

const {
    validateText,
    handleParserError,
} = require("./parser.utility");

const parse = async (filePath) => {
    try {
        const markdown = await fs.readFile(filePath, "utf8");

        return {
            text: validateText(markdown, "Markdown"),
        };
    } catch (error) {
        handleParserError(error, "Markdown");
    }
};

module.exports = {
    parse,
};