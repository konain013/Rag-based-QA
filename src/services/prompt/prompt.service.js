const buildPrompt = ({ question, relevantChunks }) => {

    if (!question?.trim()) {
        throw new Error("Question is required.");
    }

    if (!relevantChunks.length) {
        throw new Error("No relevant context found.");
    }

    const context = relevantChunks
        .map((chunk, index) => `
### Context ${index + 1}
File: ${chunk.metadata?.originalName || "Unknown"}

${chunk.content}
`)
        .join("\n\n");

    return `You are an AI assistant specialized in answering questions from uploaded documents.

Your task is to answer the user's question using ONLY the provided context.

Rules:
- Use only the information available in the context.
- Do not use your own knowledge.
- If the answer is not present in the context, reply:
  "I couldn't find that information in the uploaded document."
- Keep the answer concise and accurate.
- If the answer exists in multiple context sections, combine the information into one clear response.
- Do not mention chunk numbers or internal metadata.

Context:
${context}

Question:
${question}

Answer:`;
};

module.exports = { buildPrompt }