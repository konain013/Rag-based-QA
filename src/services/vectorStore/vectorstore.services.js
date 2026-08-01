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

const searchSimilarChunks = async ({
    queryEmbedding,
    userId,
    fileId = null,
    limit = 5,
}) => {

    if (!queryEmbedding?.length) {
        throw new Error("Query embedding is required.");
    }

    if (!userId) {
        throw new Error("User ID is required.");
    }

    let query = `
        SELECT
            chunk_index,
            content,
            mongo_file_id,
            metadata,
            embedding <=> $2::vector AS distance
        FROM document_chunks
        WHERE user_id = $1
    `;

    const values = [
        userId,
        `[${queryEmbedding.join(",")}]`,
    ];

    // File-specific search
    if (fileId) {
        query += ` AND mongo_file_id = $3`;
        values.push(fileId);

        query += `
            ORDER BY embedding <=> $2::vector
            LIMIT $4;
        `;

        values.push(limit);
    }
    // Global search (all user's files)
    else {
        query += `
            ORDER BY embedding <=> $2::vector
            LIMIT $3;
        `;

        values.push(limit);
    }

    const { rows } = await pool.query(query, values);

    return rows;
};

module.exports = {
    storeChunks,
    searchSimilarChunks
};