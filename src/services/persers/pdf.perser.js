const fs = require("fs/promises");
const pdfParse = require("pdf-parse");

const {
    validateText,
    handleParserError,
} = require("./parser.utility");

const parse = async (filePath) => {
    try {
        const buffer = await fs.readFile(filePath);

        const { text } = await pdfParse(buffer);

        return {
            text: validateText(text, "PDF"),
        };
    } catch (error) {
        handleParserError(error, "PDF");
    }
};

module.exports = {
    parse,
};