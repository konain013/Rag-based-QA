const { generateEmbedding } = require("../embeddings/embedding.service");

const { searchSimilarChunks } = require("../vectorStore/vectorstore.services");

const askQuestion = async ({ question, fileId ,userId }) => {

    if (!question || !question.trim()) {
        throw new Error("Question is required.");
    }

    // Generate embedding for user's question
    const queryEmbedding = await generateEmbedding(question);

    // Retrieve relevant chunks from PostgreSQL
    const relevantChunks = await searchSimilarChunks({
        queryEmbedding,
        userId,
        fileId
    });

    return relevantChunks;
};

module.exports = {
    askQuestion,
};