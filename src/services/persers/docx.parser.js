const mammoth = require("mammoth");

const { validateText, handleParserError } = require("./parser.utility");
const { cleanText } = require("../../utils/cleanText");

const parse = async (filePath) => {
  try {
    const { value } = await mammoth.extractRawText({
      path: filePath,
    });

    const cleanedText = cleanText(value);

    validateText(cleanedText);

    return {
      text: cleanedText,
    };
  } catch (error) {
    handleParserError(error, "DOCX");
  }
};

module.exports = {
  parse,
};
