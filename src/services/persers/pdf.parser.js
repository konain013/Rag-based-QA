const fs = require("fs/promises");
const { PDFParse } = require("pdf-parse");

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

        return {
            text: validateText(text, "PDF"),
        };
    } catch (error) {
        handleParserError(error, "PDF");
    } finally {
        if (parser) await parser.destroy();
    }
};

module.exports = {
    parse,
};