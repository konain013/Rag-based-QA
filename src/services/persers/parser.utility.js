const validateText = (text, fileType) => {
    if (!text || !text.trim()) {
        throw new Error(`${fileType} contains no readable text.`);
    }

    return text.trim();
};

const handleParserError = (error, fileType) => {
    throw new Error(`${fileType} parsing failed: ${error.message}`);
};

module.exports = {
    validateText,
    handleParserError,
};