const { pipeline } = require("@huggingface/transformers");
const embeddingConfig = require("../../config/embedding.config");

let extractor = null;

const loadModel = async () => {
    if (extractor) {
        return extractor;
    }

    extractor = await pipeline(
        "feature-extraction",
        embeddingConfig.model
    );

    return extractor;
};

const generateEmbedding = async (text) => {
    if (!text) {
        throw new Error("Text is required.");
    }

    const model = await loadModel();

    const output = await model(text, embeddingConfig.options);

    const embedding = Array.from(output.data);

    if (!embedding.length) {
        throw new Error("Failed to generate embedding.");
    }

    return embedding;
};


const generateEmbeddings = async (chunks) => {
    if (!Array.isArray(chunks) || chunks.length === 0) {
        throw new Error("Chunks array is required.");
    }

    const model = await loadModel();

    const results = [];

    for (const [index, chunk] of chunks.entries()) {

        const embedding = await generateEmbedding(chunk);

        results.push({
            chunkIndex: index,
            content: chunk,
            embedding,
        });
    }

    return results;
};

module.exports = {
    generateEmbedding,
    generateEmbeddings,
};