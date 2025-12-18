# Current Data Storage Analysis

## Database Overview
**Project URL:** https://gjlcgffrzuqxkgbkrmrw.supabase.co

---

## Current Tables & Data

### 1. **family_members** (Personas)
**Purpose:** Stores legacy personas/family members

**Current State:**
- 5 family members exist
- Most have NULL personality and bio fields
- No chat messages yet

**Fields:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - Links to profiles
- `name` (TEXT) - Persona name
- `relationship` (TEXT) - e.g., "Mom", "father"
- `date_of_birth` (DATE) - Optional
- `bio` (TEXT) - Biography (mostly NULL)
- `personality` (TEXT) - AI system instruction (mostly NULL)
- `sample_questions` (TEXT[]) - Array of sample questions
- `voice_clone_id` (TEXT) - For voice cloning
- `avatar_url` (TEXT) - Profile image
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Sample Data:**
- Pamela Bullock (Mom) - 33 assets, no messages
- Henry Moses - 38 assets, no messages
- Michael Adams (father) - 9 assets, no messages
- Naia Butler-Craig - 3 assets, no messages

**What's Missing:**
- No structured memories/life data storage
- No vector embeddings for semantic search

---

### 2. **chat_messages**
**Purpose:** Stores chat messages between users and personas

**Current State:**
- 0 messages (empty table)
- Ready to use but not yet populated

**Fields:**
- `id` (UUID) - Primary key
- `family_member_id` (UUID) - Links to persona
- `user_id` (UUID) - Links to user
- `role` (TEXT) - 'user' or 'model'
- `message_type` (TEXT) - 'text' or 'audio'
- `text_content` (TEXT) - Message text
- `audio_url` (TEXT) - Audio file URL (for user recordings)
- `transcript` (TEXT) - Transcription of audio
- `duration` (INTEGER) - Audio duration in seconds
- `created_at` (TIMESTAMPTZ)

**What's Missing:**
- No field for AI-generated voice responses
- No streaming state tracking
- No conversation grouping (needs conversation_id)

---

### 3. **conversations**
**Purpose:** Stores uploaded conversation recordings

**Current State:**
- 0 conversations
- Designed for user-uploaded audio files

**Fields:**
- `id` (UUID) - Primary key
- `user_id` (UUID)
- `family_member_id` (UUID)
- `title` (TEXT)
- `transcription` (TEXT) - Full text transcription
- `audio_url` (TEXT) - Uploaded audio file
- `duration_seconds` (INTEGER)
- `recorded_at` (TIMESTAMPTZ)

**Use Case:**
- User uploads a recorded conversation
- System transcribes it
- Can be used as source material for persona

---

### 4. **conversation_segments**
**Purpose:** Individual stories/moments extracted from conversations

**Current State:**
- 0 segments

**Fields:**
- `id` (UUID)
- `conversation_id` (UUID)
- `title` (TEXT)
- `content` (TEXT)
- `start_time`, `end_time` (INTEGER)
- `tags` (TEXT[])

**Use Case:**
- Break down long conversations into searchable segments

---

### 5. **conversation_insights**
**Purpose:** AI-generated insights from conversations

**Current State:**
- 0 insights

**Fields:**
- `id` (UUID)
- `conversation_id` (UUID)
- `insight_type` (TEXT) - summary, key_moments, themes, sentiment, questions
- `content` (JSONB) - Structured insight data

---

### 6. **assets**
**Purpose:** User-uploaded files (videos, images, audio, documents, links)

**Current State:**
- 83 assets stored
- Supports multiple storage providers (Supabase, Mux, R2)

**Fields:**
- `id` (UUID)
- `user_id` (UUID)
- `family_member_id` (UUID) - Optional link to persona
- `type` (TEXT) - 'link', 'video', 'image', 'audio', 'document'
- `title`, `description` (TEXT)
- `file_url` (TEXT) - Storage URL
- `file_size` (BIGINT)
- `mime_type` (TEXT)
- `metadata` (JSONB) - Additional data (dimensions, duration, etc.)
- `storage_provider` (TEXT) - 'supabase', 'mux', 'r2'

**Current Usage:**
- 33 assets linked to Pamela Bullock
- 38 assets linked to Henry Moses
- 9 assets linked to Michael Adams
- 3 assets linked to Naia Butler-Craig

---

### 7. **responses**
**Purpose:** Responses to scheduled questions

**Current State:**
- 1 response stored

**Fields:**
- `id` (UUID)
- `scheduled_question_id` (UUID)
- `family_member_id` (UUID)
- `response_text` (TEXT)
- `audio_url` (TEXT) - User-recorded response
- `video_url` (TEXT) - User-recorded video
- `transcription` (TEXT)
- `answered_at` (TIMESTAMPTZ)

---

### 8. **website_personas**
**Purpose:** Demo personas for public website

**Current State:**
- 4 personas (separate from main app)

**Fields:**
- Similar to family_members but for public demo
- `display_order` (INTEGER)
- `is_active` (BOOLEAN)

**Note:** This is separate from the main app's family_members table

---

### 9. **website_chat_messages**
**Purpose:** Chat messages for website demo

**Current State:**
- 0 messages
- Uses `session_id` instead of user_id

---

## Key Findings

### ✅ What's Working:
1. **Database structure is solid** - Good foundation with proper relationships
2. **Assets storage** - 83 assets successfully stored
3. **Family members table** - Ready to store personas
4. **Chat messages table** - Structure exists, ready to use

### ❌ What's Missing:
1. **No vector embeddings** - Can't do semantic search yet
2. **No memories table** - No structured way to store large amounts of life data
3. **No AI voice storage** - chat_messages has audio_url but it's for user recordings, not AI-generated
4. **No conversation grouping** - chat_messages doesn't have conversation_id
5. **Vector extension not enabled** - Available but not installed

### 🔧 What Needs to be Added:

1. **persona_memories table**
   - Store large text chunks about their life
   - Link to family_member_id
   - Support metadata

2. **persona_embeddings table**
   - Store vector embeddings (768 dimensions)
   - Link to memory_id
   - Enable semantic search

3. **chat_messages updates**
   - Add `ai_audio_url` field for AI-generated voice
   - Add `conversation_id` field (or use existing conversations table)

4. **Vector search function**
   - PostgreSQL function for cosine similarity
   - Enable semantic memory retrieval

---

## Data Flow Analysis

### Current Flow:
```
User → Preservation Wizard → family_members (basic info only)
User → Assets Upload → assets table (files stored)
User → Chat → chat_messages (but empty, not used yet)
```

### Desired Flow:
```
User → Preservation Wizard → 
  ├─ family_members (persona info)
  ├─ persona_memories (large life data)
  └─ persona_embeddings (vector embeddings)

User → Chat →
  ├─ chat_messages (text + AI audio)
  ├─ Vector search (retrieve relevant memories)
  └─ Streaming response (token by token)
```

---

## Next Steps

See `IMPLEMENTATION_PHASES.md` for detailed phase-by-phase implementation plan.

**Priority 1:** Phase 1 - Database Schema
- Enable vector extension
- Create memories and embeddings tables
- Add AI audio URL to chat_messages

**Priority 2:** Phase 2 - Database Service Layer
- Create service classes for all database operations

**Priority 3:** Phase 3-5 - Core Services
- Embedding service
- AI service with streaming
- Voice service

**Priority 4:** Phase 6-7 - Frontend Integration
- Update ChatInterface
- Update PreservationWizard

