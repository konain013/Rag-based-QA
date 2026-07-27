const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { chunking } = require("../../config/rag.config");

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: chunking.chunkSize,
    chunkOverlap: chunking.chunkOverlap,
    separators: chunking.separators,
});

const splitIntoChunks = async (text) => {
    if (!text || typeof text !== "string") {
        throw new Error("Valid text is required for chunking.");
    }

    const chunks = await splitter.splitText(text);

    return chunks;
};

module.exports = {
    splitIntoChunks,
};