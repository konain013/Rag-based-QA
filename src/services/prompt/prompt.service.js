const buildPrompt = ({ question, relevantChunks, historyMessages, }) => {

    if (!question?.trim()) {
        throw new Error("Question is required.");
    }

    if (!relevantChunks.length) {
        throw new Error("No relevant context found.");
    }

    const conversationHistory = historyMessages
    .map(
        (message) => `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`
    )
    .join("\n");

    const context = relevantChunks
        .map((chunk, index) => `
### Context ${index + 1}
File: ${chunk.metadata?.originalName || "Unknown"}

${chunk.content}
`)
        .join("\n\n");

    return `
You are a professional AI assistant.

Answer the user's question naturally.

Do not say:
- "Based on the provided context"
- "According to the document"
- "The document states"

Just answer directly as if you already know the answer.

If the information is not available, reply exactly:

"I couldn't find that information in the uploaded document."

Conversation History:
${conversationHistory}

Context:
${context}

Current Question:
${question}

Answer:
`
};
module.exports = { buildPrompt }