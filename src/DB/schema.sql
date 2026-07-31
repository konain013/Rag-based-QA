-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create document_chunks table
CREATE TABLE document_chunks (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mongo_file_id TEXT NOT NULL,

    user_id TEXT NOT NULL,

    chunk_index INTEGER NOT NULL,

    content TEXT NOT NULL,

    embedding VECTOR(384) NOT NULL,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()
);