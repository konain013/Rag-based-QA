const XLSX = require("xlsx");

const {
    validateText,
    handleParserError,
} = require("./parser.utility");

const parse = async (filePath) => {
    try {
        const workbook = XLSX.readFile(filePath);

        let text = "";

        workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];

            text += XLSX.utils.sheet_to_csv(worksheet);
            text += "\n";
        });

        return {
            text: validateText(text, "XLSX"),
        };
    } catch (error) {
        handleParserError(error, "XLSX");
    }
};

module.exports = {
    parse,
};