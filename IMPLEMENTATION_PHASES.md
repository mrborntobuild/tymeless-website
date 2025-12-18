# Tymeless Implementation Phases

## Current Database State Analysis

### ✅ What We Have:
1. **family_members** table - Stores persona information
   - Fields: name, relationship, bio, personality, sample_questions, voice_clone_id
   - 5 family members exist (but most have NULL personality/bio)
   
2. **chat_messages** table - Stores chat messages
   - Fields: role, message_type, text_content, audio_url, transcript
   - Currently empty (0 messages)
   - Missing: AI-generated voice audio URL field

3. **conversations** table - Stores uploaded conversation recordings
   - Has transcription, audio_url, duration_seconds
   - Good for storing user-uploaded audio

4. **assets** table - Stores user-uploaded files
   - 83 assets currently stored
   - Supports: link, video, image, audio, document

5. **vector extension** - Available but NOT installed

### ❌ What's Missing:
- Vector embeddings table for semantic search
- Memories/life data table (separate from conversations)
- AI-generated voice audio storage in chat_messages
- Vector search functions
- Streaming response tracking

---

## Phase 1: Database Schema Foundation
**Goal:** Set up database tables for memories, embeddings, and voice storage

### Tasks:
1. ✅ Enable `vector` extension
2. ✅ Create `persona_memories` table
   - Store large amounts of life data
   - Link to family_member_id
   - Support metadata JSONB for context
3. ✅ Create `persona_embeddings` table
   - Store vector embeddings (768 dimensions)
   - Link to memory_id and family_member_id
   - Index for fast similarity search
4. ✅ Add `ai_audio_url` field to `chat_messages` table
   - Store AI-generated voice responses
5. ✅ Create vector search function
   - PostgreSQL function for cosine similarity search

**Migration Name:** `add_vector_search_and_memories`

---

## Phase 2: Database Service Layer
**Goal:** Create service classes for all database operations

### Tasks:
1. ✅ Create `services/database/supabaseClient.ts`
   - Initialize Supabase client
   - Export singleton instance
2. ✅ Create `services/database/personaService.ts`
   - `savePersona()` - Save persona to family_members
   - `getPersona()` - Get persona with all related data
   - `getPersonasByUser()` - List all personas for user
3. ✅ Create `services/database/memoryService.ts`
   - `saveMemories()` - Save large amounts of life data
   - `getMemories()` - Retrieve memories for persona
   - `chunkMemories()` - Split large text into chunks
4. ✅ Create `services/database/chatService.ts`
   - `saveMessage()` - Save chat message
   - `getConversation()` - Get all messages for conversation
   - `createConversation()` - Create new conversation

**Files Created:**
- `services/database/supabaseClient.ts`
- `services/database/personaService.ts`
- `services/database/memoryService.ts`
- `services/database/chatService.ts`

---

## Phase 3: Embedding Service
**Goal:** Generate and manage vector embeddings for semantic search

### Tasks:
1. ✅ Create `services/embeddings/embeddingService.ts`
   - `generateEmbedding()` - Use Gemini embedding model
   - `embedMemories()` - Process and embed all memories
   - `batchEmbed()` - Efficient batch processing
2. ✅ Create `services/embeddings/vectorSearch.ts`
   - `findRelevantMemories()` - Semantic search using vectors
   - `getContextForQuery()` - Retrieve top N relevant memories
   - `calculateSimilarity()` - Helper for similarity scores

**Dependencies:**
- Gemini API for embeddings
- Vector extension in PostgreSQL

**Files Created:**
- `services/embeddings/embeddingService.ts`
- `services/embeddings/vectorSearch.ts`

---

## Phase 4: AI Service Updates
**Goal:** Add streaming and RAG (Retrieval Augmented Generation)

### Tasks:
1. ✅ Update `services/ai/geminiService.ts`
   - Add `streamPersonaResponse()` - Streaming generator function
   - Add `createPersonaChatWithRAG()` - Chat with context retrieval
   - Update `generatePersonalityProfile()` - Keep existing functionality
2. ✅ Create `services/ai/contextRetrieval.ts`
   - `retrieveRelevantContext()` - Get relevant memories for query
   - `buildContextString()` - Format context for AI prompt
   - `getTopMemories()` - Get top N memories by similarity

**Key Features:**
- Streaming responses (token by token)
- RAG: Retrieve relevant memories before generating response
- Context-aware responses

**Files Modified:**
- `services/ai/geminiService.ts`

**Files Created:**
- `services/ai/contextRetrieval.ts`

---

## Phase 5: Voice Service
**Goal:** Generate and store AI voice responses

### Tasks:
1. ✅ Create `services/voice/textToSpeech.ts`
   - `generateVoiceAudio()` - Convert text to speech
   - `selectVoiceForPersona()` - Choose appropriate voice
   - `generateAudioStream()` - Stream audio generation (if supported)
2. ✅ Create `services/voice/audioStorage.ts`
   - `saveAudioToStorage()` - Upload to Supabase Storage
   - `getAudioUrl()` - Get public URL for audio
   - `deleteAudio()` - Clean up old audio files

**Voice Options:**
- Google Cloud Text-to-Speech API
- ElevenLabs API (if available)
- Gemini Audio API (if available)

**Storage:**
- Supabase Storage bucket: `ai-voice-responses`
- Path structure: `{family_member_id}/{message_id}.mp3`

**Files Created:**
- `services/voice/textToSpeech.ts`
- `services/voice/audioStorage.ts`

---

## Phase 6: Frontend Integration - Chat Interface
**Goal:** Update ChatInterface with streaming and voice playback

### Tasks:
1. ✅ Update `components/ChatInterface.tsx`
   - Add streaming text display (token by token)
   - Add voice playback button for AI responses
   - Add loading states for streaming
   - Save messages to database
   - Load conversation history on mount
2. ✅ Add audio player component
   - Play/pause controls
   - Progress indicator
   - Auto-play option (with user consent)
3. ✅ Update message display
   - Show streaming indicator
   - Display audio player for voice responses
   - Handle both text and audio messages

**Key Features:**
- Real-time streaming text
- Voice playback for AI responses
- Conversation persistence
- Loading states

**Files Modified:**
- `components/ChatInterface.tsx`

---

## Phase 7: Preservation Wizard Updates
**Goal:** Save large amounts of life data and generate embeddings

### Tasks:
1. ✅ Update `components/PreservationWizard.tsx`
   - Save persona to database (family_members table)
   - Save memories to persona_memories table
   - Trigger embedding generation after save
   - Show progress for embedding generation
2. ✅ Add memory chunking
   - Split large text into manageable chunks
   - Preserve context across chunks
   - Handle very large inputs (10k+ words)
3. ✅ Add embedding progress indicator
   - Show "Processing memories..." state
   - Display progress percentage
   - Handle errors gracefully

**Key Features:**
- Save large amounts of text data
- Automatic embedding generation
- Progress feedback
- Error handling

**Files Modified:**
- `components/PreservationWizard.tsx`

---

## Phase 8: Testing & Optimization
**Goal:** Test all features and optimize performance

### Tasks:
1. ✅ Test vector search accuracy
   - Verify relevant memories are retrieved
   - Test with various query types
2. ✅ Test streaming performance
   - Measure latency
   - Test with long responses
3. ✅ Test voice generation
   - Verify audio quality
   - Test storage and retrieval
4. ✅ Optimize embedding generation
   - Batch processing
   - Caching strategies
5. ✅ Add error handling
   - Network errors
   - API rate limits
   - Database errors

---

## Dependencies to Install

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@google-cloud/text-to-speech": "^5.0.0"
  }
}
```

## Environment Variables Needed

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

## Database Migration Summary

### New Tables:
1. `persona_memories` - Store life data
2. `persona_embeddings` - Store vector embeddings

### Modified Tables:
1. `chat_messages` - Add `ai_audio_url` field

### New Functions:
1. `match_memories()` - Vector similarity search

### Extensions:
1. `vector` - Enable for pgvector support

---

## Success Criteria

- ✅ Large amounts of life data can be saved (10k+ words)
- ✅ Vector embeddings are generated and stored
- ✅ Semantic search retrieves relevant memories
- ✅ Chat responses stream token by token
- ✅ AI responses have voice audio versions
- ✅ All data persists in database
- ✅ Performance is acceptable (< 2s for search, < 5s for voice)

