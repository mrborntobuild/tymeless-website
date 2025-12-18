# Website Testing Tables

## Overview
Created comprehensive testing tables for website personas with support for:
- ✅ Large amounts of life data storage
- ✅ Vector embeddings for semantic search
- ✅ AI-generated voice responses
- ✅ Conversation grouping

---

## New Tables Created

### 1. **website_memories**
Stores large amounts of life data for website personas.

**Schema:**
```sql
CREATE TABLE website_memories (
  id UUID PRIMARY KEY,
  website_persona_id UUID NOT NULL REFERENCES website_personas(id),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:**
- Store large text chunks about persona's life
- Support metadata for additional context
- Link to website_persona_id

**Example Usage:**
```sql
INSERT INTO website_memories (website_persona_id, content, metadata)
VALUES (
  'persona-uuid',
  'I grew up in Chicago during the 1950s. My father worked at the steel mill...',
  '{"source": "conversation", "date": "2024-01-15"}'
);
```

---

### 2. **website_embeddings**
Stores vector embeddings for semantic search.

**Schema:**
```sql
CREATE TABLE website_embeddings (
  id UUID PRIMARY KEY,
  memory_id UUID NOT NULL REFERENCES website_memories(id),
  website_persona_id UUID NOT NULL REFERENCES website_personas(id),
  embedding vector(768),
  content_chunk TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:**
- Store 768-dimensional vector embeddings
- Enable semantic similarity search
- Link embeddings to memories and personas

**Indexes:**
- `idx_website_embeddings_persona_id` - Fast persona lookups
- `idx_website_embeddings_memory_id` - Fast memory lookups
- `idx_website_embeddings_vector` - IVFFlat index for vector search

**Example Usage:**
```sql
INSERT INTO website_embeddings (memory_id, website_persona_id, embedding, content_chunk)
VALUES (
  'memory-uuid',
  'persona-uuid',
  '[0.123, -0.456, ...]'::vector(768),
  'I grew up in Chicago during the 1950s...'
);
```

---

### 3. **website_conversations**
Groups chat messages into conversations.

**Schema:**
```sql
CREATE TABLE website_conversations (
  id UUID PRIMARY KEY,
  website_persona_id UUID REFERENCES website_personas(id),
  session_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, website_persona_id)
);
```

**Purpose:**
- Group messages by session
- Track conversation metadata
- Link to website_persona_id

**Example Usage:**
```sql
INSERT INTO website_conversations (website_persona_id, session_id, title)
VALUES (
  'persona-uuid',
  'session-abc-123',
  'First conversation'
);
```

---

## Updated Tables

### **website_chat_messages**
Added two new columns:

1. **ai_audio_url** (TEXT)
   - Stores URL to AI-generated voice audio
   - Used for model responses with voice

2. **conversation_id** (UUID)
   - Links to website_conversations table
   - Groups messages into conversations

**Updated Schema:**
```sql
ALTER TABLE website_chat_messages 
ADD COLUMN ai_audio_url TEXT,
ADD COLUMN conversation_id UUID REFERENCES website_conversations(id);
```

---

## Vector Search Function

### **match_website_memories()**
Performs semantic similarity search using vector embeddings.

**Function Signature:**
```sql
CREATE FUNCTION match_website_memories(
  query_embedding vector(768),
  match_persona_id uuid,
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  memory_id uuid,
  content text,
  similarity float
)
```

**Parameters:**
- `query_embedding` - Vector embedding of the search query
- `match_persona_id` - Persona to search within
- `match_threshold` - Minimum similarity score (0-1)
- `match_count` - Maximum number of results

**Returns:**
- `memory_id` - UUID of the matching memory
- `content` - The content chunk that matched
- `similarity` - Similarity score (0-1, higher is better)

**Example Usage:**
```sql
SELECT * FROM match_website_memories(
  '[0.123, -0.456, ...]'::vector(768),
  'persona-uuid'::uuid,
  0.7,  -- threshold
  5     -- max results
);
```

---

## Indexes Created

### Performance Indexes:
1. `idx_website_memories_persona_id` - Fast persona memory lookups
2. `idx_website_embeddings_persona_id` - Fast persona embedding lookups
3. `idx_website_embeddings_memory_id` - Fast memory embedding lookups
4. `idx_website_chat_messages_session_id` - Fast session message lookups
5. `idx_website_chat_messages_conversation_id` - Fast conversation message lookups
6. `idx_website_conversations_session_id` - Fast session conversation lookups
7. `idx_website_embeddings_vector` - IVFFlat index for vector similarity search

---

## Triggers

### Auto-update Timestamps:
- `update_website_memories_updated_at` - Updates `updated_at` on memory changes
- `update_website_conversations_updated_at` - Updates `updated_at` on conversation changes

---

## Data Flow Example

### 1. Create Persona with Memories
```sql
-- Insert persona
INSERT INTO website_personas (name, relation, personality, ...)
VALUES ('Martha Lewis', 'Grandmother', 'I am a gentle...', ...)
RETURNING id;

-- Insert memories
INSERT INTO website_memories (website_persona_id, content)
VALUES 
  ('persona-id', 'Large chunk of life story 1...'),
  ('persona-id', 'Large chunk of life story 2...');
```

### 2. Generate Embeddings
```typescript
// In your service
const memories = await getMemories(personaId);
for (const memory of memories) {
  const embedding = await generateEmbedding(memory.content);
  await saveEmbedding(memory.id, personaId, embedding, memory.content);
}
```

### 3. Search Relevant Memories
```typescript
// When user asks a question
const queryEmbedding = await generateEmbedding(userQuestion);
const relevantMemories = await match_website_memories(
  queryEmbedding,
  personaId,
  0.7,  // threshold
  5     // top 5 results
);
```

### 4. Generate Response with Context
```typescript
const context = relevantMemories.map(m => m.content).join('\n\n');
const response = await generateAIResponse(context, userQuestion);
```

### 5. Save Chat Message with Voice
```sql
-- Create conversation
INSERT INTO website_conversations (website_persona_id, session_id)
VALUES ('persona-id', 'session-123')
RETURNING id;

-- Save user message
INSERT INTO website_chat_messages (
  conversation_id, website_persona_id, session_id, 
  role, text_content
)
VALUES ('conv-id', 'persona-id', 'session-123', 'user', 'Tell me about...');

-- Save AI response with voice
INSERT INTO website_chat_messages (
  conversation_id, website_persona_id, session_id,
  role, text_content, ai_audio_url
)
VALUES (
  'conv-id', 'persona-id', 'session-123',
  'model', 'I remember when...', 'https://storage.../audio.mp3'
);
```

---

## Testing Checklist

- [ ] Insert test persona
- [ ] Insert large amounts of memory data (10k+ words)
- [ ] Generate embeddings for memories
- [ ] Test vector search function
- [ ] Create conversation
- [ ] Save chat messages with AI audio URLs
- [ ] Query conversation history
- [ ] Test streaming responses
- [ ] Verify voice playback works

---

## Next Steps

1. **Create Service Classes**
   - `services/database/websitePersonaService.ts`
   - `services/database/websiteMemoryService.ts`
   - `services/database/websiteChatService.ts`

2. **Update Frontend**
   - Connect ChatInterface to website tables
   - Add memory upload functionality
   - Implement vector search in chat

3. **Add Test Data**
   - Insert sample personas
   - Insert sample memories
   - Generate test embeddings

---

## Notes

- Vector extension is enabled
- All tables use UUID primary keys
- Foreign keys have CASCADE delete for data integrity
- Indexes are optimized for common query patterns
- Vector search uses cosine similarity (1 - distance)

