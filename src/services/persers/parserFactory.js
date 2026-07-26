const pdfParser = require("./pdf.parser");
const docxParser = require("./docx.parser");
const xlsxParser = require("./xlsx.parser");
const htmlParser = require("./html.parser");
const markdownParser = require("./markdown.parser");
const getParser = (extension) => {
    switch (extension.toLowerCase()) {
        case ".pdf":
            return pdfParser;

        case ".docx":
            return docxParser;

        case ".xlsx":
            return xlsxParser;

        case ".html":
            return htmlParser;

        case ".md":
            return markdownParser;

        default:
            throw new Error("Unsupported file type.");
    }
};

module.exports = {
    getParser,
};