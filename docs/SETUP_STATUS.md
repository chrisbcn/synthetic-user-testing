# Setup Status - Video Generation & Storage

## Current Status

### ✅ What's Working

1. **Veo 3 API Integration**
   - API route exists: `/api/video/veo3`
   - Vertex AI helpers configured (`lib/google-cloud.ts`)
   - ADC authentication set up locally
   - Video generation flow integrated in UI

2. **Video Storage (Partial)**
   - Vercel Blob storage configured for manual uploads
   - Videos can be uploaded and listed

### ⚠️ What Needs Setup

1. **Vertex AI Veo 3 API**
   - Need to verify actual API endpoint format
   - May need to adjust request/response structure
   - Need to test with actual Veo 3 API

2. **Supabase Database**
   - ❌ Not installed (`@supabase/supabase-js` missing)
   - ❌ No Supabase client configured
   - ❌ No database schema for videos
   - ❌ Generated videos not persisted (only in component state)

## What Needs to Be Done

### 1. Verify Vertex AI Veo 3 API Format

The current implementation assumes a specific API format. We need to:
- Check Google Cloud Vertex AI Veo 3 documentation
- Verify endpoint URL format
- Verify request payload structure
- Verify response structure

### 2. Set Up Supabase

**Install Supabase:**
```bash
npm install @supabase/supabase-js
```

**Create Supabase Client:**
- Create `lib/supabase.ts` with client initialization
- Add environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

**Create Database Schema:**
```sql
-- videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id TEXT,
  persona_id TEXT,
  response_text TEXT,
  video_prompt TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  status TEXT CHECK (status IN ('pending', 'generating', 'completed', 'failed', 'error')),
  provider TEXT,
  task_id TEXT,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_at TIMESTAMP WITH TIME ZONE,
  project_id TEXT,
  title TEXT,
  error TEXT
);

-- Create index for faster queries
CREATE INDEX idx_videos_interview_id ON videos(interview_id);
CREATE INDEX idx_videos_persona_id ON videos(persona_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
```

**Create API Routes:**
- `/api/videos/save` - Save generated video metadata
- `/api/videos/get` - Get videos by interview/persona
- Update `/api/video/veo3` to save to Supabase after generation

### 3. Update Video Generation Flow

After Veo 3 generates a video:
1. Download video from Veo 3 URL (if needed)
2. Upload to Vercel Blob (or keep Veo 3 URL)
3. Save metadata to Supabase
4. Return video info to frontend

## Next Steps

1. **Test Veo 3 API** - Verify the endpoint works with actual API
2. **Set up Supabase** - Install, configure, create schema
3. **Update video generation** - Save to Supabase after generation
4. **Update frontend** - Load videos from Supabase instead of localStorage

