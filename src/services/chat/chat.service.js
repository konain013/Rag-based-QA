const { generateEmbedding } = require("../embeddings/embedding.service");

const { searchSimilarChunks } = require("../vectorStore/vectorstore.services");

const { buildPrompt } = require("../prompt/prompt.service");

const { generateResponse } = require("../LLM/llm.service");

const { getOrCreateSession } = require("./chatSession.service");
const {
    saveUserMessage,
    getRecentMessages,
    saveAssistantMessage,
} = require("./message.service");

const askQuestion = async ({ question, fileId, userId, sessionId }) => {

    if (!question?.trim()) {
        throw new Error("Question is required.");
    }

    // Get existing session or create a new one
    const session = await getOrCreateSession({
        sessionId,
        userId,
    });

    // Save user's message
    await saveUserMessage({
        sessionId: session._id,
        content: question,
    });

    // Generate embedding for user's question
    const queryEmbedding = await generateEmbedding(question);

    // Retrieve relevant chunks from PostgreSQL
    const relevantChunks = await searchSimilarChunks({
        queryEmbedding,
        userId,
        fileId,
    });

    //console.log("relevantChunks.....",relevantChunks);

    const historyMessages = await getRecentMessages({
        sessionId: session._id,
        limit: 5,
    });

   
    const prompt = buildPrompt({
        question,
        relevantChunks,
        historyMessages,
    });

    const answer = await generateResponse(prompt);
    //console.log("Prompt..............",prompt)

    await saveAssistantMessage({
    sessionId: session._id,
    content: answer,
});

    return {
        sessionId: session._id,
        answer
    };
};

module.exports = {
    askQuestion,
};