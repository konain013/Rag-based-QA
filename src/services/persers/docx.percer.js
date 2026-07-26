const mammoth = require("mammoth");

const {
    validateText,
    handleParserError,
} = require("./parser.utility");

const parse = async (filePath) => {
    try {
        const { value } = await mammoth.extractRawText({
            path: filePath,
        });

        return {
            text: validateText(value, "DOCX"),
        };
    } catch (error) {
        handleParserError(error, "DOCX");
    }
};

module.exports = {
    parse,
};