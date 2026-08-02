const { generateEmbedding } = require("../embeddings/embedding.service");

const { searchSimilarChunks } = require("../vectorStore/vectorstore.services");

const { buildPrompt } = require("../prompt/prompt.service");

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

    //test
    const prompt = buildPrompt({
    question,
    relevantChunks,
});
console.log("Prompt generated:", prompt);
console.log(prompt);

    return relevantChunks;
};

module.exports = {
    askQuestion,
};