const XLSX = require("xlsx");

const {
    validateText,
    handleParserError,
} = require("./parser.utility");

const { cleanText } = require("../../utils/cleanText");

const parse = async (filePath) => {
    try {
        const workbook = XLSX.readFile(filePath);

        let text = "";

        workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];

            text += XLSX.utils.sheet_to_csv(worksheet);
            text += "\n";
        });

        const cleanedText = cleanText(text);

        validateText(cleanedText);

        return {
            text: cleanedText,
        };
    } catch (error) {
        handleParserError(error, "XLSX");
    }
};

module.exports = {
    parse,
};