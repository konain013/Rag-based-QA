const pdfParser = require("./pdf.perser");
const docxParser = require("./docx.perser");
const xlsxParser = require("./xlsx.perser");
const htmlParser = require("./html.perser");
const markdownParser = require("./markdown.perser");
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