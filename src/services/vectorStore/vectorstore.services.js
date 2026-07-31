const pool = require("../../config/postgre.config").pool;

const storeChunks = async ({
    mongoFileId,
    userId,
    metadata,
    chunks,
}) => {

    try {

        for (const chunk of chunks) {

            await pool.query(
                `
                INSERT INTO document_chunks (
                    mongo_file_id,
                    user_id,
                    chunk_index,
                    content,
                    embedding,
                    metadata
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                `,
                [
                    mongoFileId,
                    userId,
                    chunk.chunkIndex,
                    chunk.content,
                    `[${chunk.embedding.join(",")}]`,
                    JSON.stringify(metadata),
                    
                ]
            );

        }

        return {
            success: true,
            message: "Chunks stored successfully."
        };

    } catch (error) {
        throw error;
    }

};

module.exports = {
    storeChunks,
};