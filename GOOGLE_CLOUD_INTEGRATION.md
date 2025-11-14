# Google Cloud Integration - Veo 3 & Nano Banana

## Overview

This app now supports Google Cloud's Vertex AI APIs for:
- **Veo 3**: High-quality video generation from text prompts
- **Nano Banana (Gemini 2.5 Flash Image Preview)**: Image generation for persona portraits

## Quick Start

### 1. Set Environment Variables

Add to your `.env.local` or Vercel environment:

```bash
# Required
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id

# Optional (defaults to us-central1)
GOOGLE_CLOUD_LOCATION=us-central1

# Authentication (choose one):
# Option 1: Service Account JSON path
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Option 2: Access Token (for testing)
GOOGLE_CLOUD_ACCESS_TOKEN=your-access-token

# Option 3: Use Application Default Credentials (no env var needed)
# Run: gcloud auth application-default login
```

### 2. Enable APIs

In Google Cloud Console:
1. Go to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Enable **Vertex AI API**

### 3. Test Integration

The video generator will automatically try Veo 3 first if configured, then fall back to Runway ML or prompt generation.

## API Endpoints

### Veo 3 Video Generation

**Endpoint:** `POST /api/video/veo3`

**Request:**
```json
{
  "prompt": "Professional person speaking to camera",
  "persona": {
    "name": "Sophia Harrington",
    "character_bible": {
      "veo3_delivery_characteristics": {
        "speaking_pace": "measured",
        "facial_expressions": "warm",
        "hand_gestures": "subtle",
        "voice_tone": "confident",
        "posture": "elegant"
      }
    }
  },
  "responseText": "I think this feature would be valuable...",
  "duration": 10,
  "aspectRatio": "16:9"
}
```

### Nano Banana Image Generation

**Endpoint:** `POST /api/image/nano-banana`

**Request:**
```json
{
  "prompt": "Professional portrait of a 35-year-old executive",
  "aspectRatio": "1:1"
}
```

## Integration Flow

The main `/api/video` endpoint now follows this priority:

1. **Veo 3** (if `GOOGLE_CLOUD_PROJECT_ID` is set)
2. **Runway ML** (if `RUNWAY_API_KEY` is set)
3. **Prompt Generation** (using Gemini API for prompt optimization)

## Features

- ✅ Automatic Veo 3 integration when Google Cloud is configured
- ✅ Uses persona `veo3_delivery_characteristics` for better video quality
- ✅ Falls back gracefully to other providers
- ✅ Supports multiple authentication methods
- ✅ Comprehensive error handling and logging

## Documentation

See `docs/GOOGLE_CLOUD_SETUP.md` for detailed setup instructions.

