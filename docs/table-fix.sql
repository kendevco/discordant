-- Fix chat_memory table schema
-- Run this directly in your MySQL database

-- Drop and recreate the table with correct schema
DROP TABLE IF EXISTS chat_memory;

CREATE TABLE chat_memory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  role ENUM('user', 'assistant', 'system') NOT NULL,
  content LONGTEXT NOT NULL,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session_created (session_id, created_at)
);

-- Verify the table structure
DESCRIBE chat_memory;

-- Test insert to make sure it works
INSERT INTO chat_memory (session_id, user_id, role, content, metadata) 
VALUES ('test-session', 'test-user', 'user', 'Test message', JSON_OBJECT('platform', 'test'));

-- Verify the insert worked
SELECT * FROM chat_memory WHERE session_id = 'test-session';

-- Clean up test data
DELETE FROM chat_memory WHERE session_id = 'test-session'; 