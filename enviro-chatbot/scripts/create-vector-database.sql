-- Vector Database Schema for Enviro Test Construct Chatbot
-- This script creates the necessary tables for storing website content and embeddings

-- Create extension for vector operations (if using pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- Main content table
CREATE TABLE IF NOT EXISTS content_chunks (
    id SERIAL PRIMARY KEY,
    chunk_id VARCHAR(255) UNIQUE NOT NULL,
    source_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    content TEXT NOT NULL,
    chunk_index INTEGER DEFAULT 0,
    total_chunks INTEGER DEFAULT 1,
    category VARCHAR(100),
    word_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vector embeddings table
CREATE TABLE IF NOT EXISTS content_embeddings (
    id SERIAL PRIMARY KEY,
    chunk_id VARCHAR(255) REFERENCES content_chunks(chunk_id) ON DELETE CASCADE,
    embedding vector(1536), -- OpenAI ada-002 dimension
    embedding_model VARCHAR(100) DEFAULT 'text-embedding-ada-002',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    session_id UUID DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Query logs table for analytics
CREATE TABLE IF NOT EXISTS query_logs (
    id SERIAL PRIMARY KEY,
    session_id UUID,
    query TEXT NOT NULL,
    retrieved_chunks TEXT[], -- Array of chunk IDs used for context
    response_length INTEGER,
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_chunks_category ON content_chunks(category);
CREATE INDEX IF NOT EXISTS idx_content_chunks_source_url ON content_chunks(source_url);
CREATE INDEX IF NOT EXISTS idx_content_chunks_created_at ON content_chunks(created_at);

-- Vector similarity search index (for pgvector)
CREATE INDEX IF NOT EXISTS idx_content_embeddings_vector 
ON content_embeddings USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Chat-related indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_query_logs_created_at ON query_logs(created_at);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_content_chunks_updated_at 
    BEFORE UPDATE ON content_chunks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION search_similar_content(
    query_embedding vector(1536),
    similarity_threshold float DEFAULT 0.7,
    max_results integer DEFAULT 5
)
RETURNS TABLE (
    chunk_id varchar(255),
    content text,
    category varchar(100),
    similarity float,
    source_url text,
    title text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cc.chunk_id,
        cc.content,
        cc.category,
        (ce.embedding <=> query_embedding) * -1 + 1 as similarity,
        cc.source_url,
        cc.title
    FROM content_chunks cc
    JOIN content_embeddings ce ON cc.chunk_id = ce.chunk_id
    WHERE (ce.embedding <=> query_embedding) * -1 + 1 >= similarity_threshold
    ORDER BY ce.embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Insert sample categories for reference
INSERT INTO content_chunks (chunk_id, source_url, title, content, category, word_count) VALUES
('sample_company_info', 'https://envirotestconstruct.com/', 'Company Information', 
 'Enviro Test Construct delivers next-generation environmental testing technologies designed specifically for the construction sector. Based in Miami, FL, the company provides innovative solutions for environmental safety and compliance.', 
 'company-info', 32),
 
('sample_site_assessment', 'https://envirotestconstruct.com/services', 'Site Assessment Services', 
 'Site Assessment & Contamination Detection services include comprehensive soil testing, groundwater analysis, and contamination identification. Our advanced testing methodologies help identify potential environmental hazards before construction begins.', 
 'site-assessment', 28),
 
('sample_monitoring', 'https://envirotestconstruct.com/services', 'Environmental Monitoring', 
 'Environmental Monitoring & Sampling Technology encompasses real-time air quality monitoring, dust particle analysis, noise level assessment, and continuous environmental parameter tracking during construction activities.', 
 'environmental-monitoring', 25)
ON CONFLICT (chunk_id) DO NOTHING;

-- Create a view for easy content retrieval with embeddings
CREATE OR REPLACE VIEW content_with_embeddings AS
SELECT 
    cc.*,
    ce.embedding,
    ce.embedding_model
FROM content_chunks cc
LEFT JOIN content_embeddings ce ON cc.chunk_id = ce.chunk_id;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

COMMENT ON TABLE content_chunks IS 'Stores chunked website content for RAG system';
COMMENT ON TABLE content_embeddings IS 'Stores vector embeddings for semantic search';
COMMENT ON TABLE chat_sessions IS 'Tracks user chat sessions';
COMMENT ON TABLE chat_messages IS 'Stores individual chat messages';
COMMENT ON TABLE query_logs IS 'Logs queries for analytics and improvement';
