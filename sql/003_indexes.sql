CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_chunks_document ON chunks(document_id);
CREATE INDEX idx_messages_document ON messages(document_id);
CREATE INDEX idx_messages_created ON messages(document_id, created_at);