const cleanText = (text) => {
    return text
        .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "")
        .replace(/Page\s+\d+/gi, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
};

module.exports = {
    cleanText,
};