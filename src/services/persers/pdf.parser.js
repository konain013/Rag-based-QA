const fs = require("fs/promises");
const { PDFParse } = require("pdf-parse");
const { cleanText } = require("../../utils/cleanText");

const {
    validateText,
    handleParserError,
} = require("./parser.utility");

const parse = async (filePath) => {
    let parser;

    try {
        const buffer = await fs.readFile(filePath);

        parser = new PDFParse({ data: buffer });

        const { text } = await parser.getText();

        const cleanedText = cleanText(text);

        validateText(cleanedText);

        return {
            text: cleanedText,
        };
    } catch (error) {
        handleParserError(error, "PDF");
    } finally {
        if (parser) {
            await parser.destroy();
        }
    }
};

module.exports = {
    parse,
};