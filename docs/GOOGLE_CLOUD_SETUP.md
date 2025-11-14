# Google Cloud Integration Setup Guide

This guide will help you integrate Google Cloud's Veo 3 (video generation) and Nano Banana (image generation) APIs into your Synthetic User Testing Platform.

## Prerequisites

1. **Google Cloud Project**: You need an active Google Cloud project
2. **Billing Enabled**: Both Veo 3 and Nano Banana are paid services
3. **API Access**: Enable the required APIs in your GCP project

## Step 1: Enable Required APIs

In your Google Cloud Console:

1. Go to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Enable the following APIs:
   - **Vertex AI API** (required for Veo 3 and Nano Banana)
   - **Generative Language API** (if using Gemini for prompts)

## Step 2: Set Up Authentication

You have three options for authentication:

### Option A: Service Account (Recommended for Production)

1. **Create a Service Account:**
   ```bash
   # Using gcloud CLI
   gcloud iam service-accounts create synth-users-sa \
     --display-name="Synthetic Users Service Account"
   ```

2. **Grant Required Permissions:**
   ```bash
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:synth-users-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"
   ```

3. **Create and Download Key:**
   ```bash
   gcloud iam service-accounts keys create key.json \
     --iam-account=synth-users-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

4. **Set Environment Variable:**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
   ```

### Option B: Access Token (For Testing)

1. **Get Access Token:**
   ```bash
   gcloud auth application-default print-access-token
   ```

2. **Set Environment Variable:**
   ```bash
   export GOOGLE_CLOUD_ACCESS_TOKEN="your-access-token-here"
   ```

### Option C: Application Default Credentials (For Local Development)

```bash
gcloud auth application-default login
```

This will use your personal credentials for local development.

## Step 3: Configure Environment Variables

Add these to your `.env.local` or Vercel environment variables:

```bash
# Required
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here

# Optional (defaults to us-central1)
GOOGLE_CLOUD_LOCATION=us-central1

# Optional - use one of these authentication methods:
# Option 1: Service Account JSON path
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Option 2: Direct access token
GOOGLE_CLOUD_ACCESS_TOKEN=your-access-token

# Option 3: Use Application Default Credentials (no env var needed)
```

## Step 4: Test the Integration

### Test Veo 3 Video Generation

```bash
curl -X POST http://localhost:3000/api/video/veo3 \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A professional person speaking directly to camera",
    "responseText": "I think this feature would be really valuable for my workflow.",
    "duration": 10,
    "aspectRatio": "16:9"
  }'
```

### Test Nano Banana Image Generation

```bash
curl -X POST http://localhost:3000/api/video/nano-banana \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Professional portrait of a 35-year-old business executive",
    "aspectRatio": "1:1"
  }'
```

## API Endpoints

### Veo 3 Video Generation

**Endpoint:** `POST /api/video/veo3`

**Request Body:**
```json
{
  "prompt": "Video generation prompt",
  "persona": {
    "name": "Sophia Harrington",
    "character_bible": {
      "veo3_delivery_characteristics": {
        "speaking_pace": "measured and thoughtful",
        "facial_expressions": "warm and engaging",
        "hand_gestures": "subtle and refined",
        "voice_tone": "confident and articulate",
        "posture": "elegant and poised"
      },
      "setting": {
        "primary_location": "corner office",
        "lighting_style": "soft natural light",
        "mood_atmosphere": "professional yet welcoming"
      }
    }
  },
  "responseText": "The quote to be spoken",
  "duration": 10,
  "aspectRatio": "16:9"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Video generation started with Veo 3",
  "videoUrl": "https://...",
  "taskId": "task-123",
  "status": "generating",
  "provider": "veo-3"
}
```

### Nano Banana Image Generation

**Endpoint:** `POST /api/image/nano-banana`

**Request Body:**
```json
{
  "prompt": "Professional portrait photograph of...",
  "aspectRatio": "1:1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image generated successfully",
  "imageUrl": "https://...",
  "provider": "nano-banana"
}
```

## Integration with Existing Video Generator

The main `/api/video` endpoint now automatically tries Veo 3 first if configured:

```json
{
  "prompt": "...",
  "persona": {...},
  "responseText": "...",
  "provider": "auto" // or "veo3", "runway", "prompt-only"
}
```

## Cost Considerations

- **Veo 3**: Pay-per-use pricing (check current rates in GCP console)
- **Nano Banana**: Pay-per-use pricing
- **Vertex AI API**: Standard API usage charges apply

Monitor usage in [Google Cloud Console > Billing](https://console.cloud.google.com/billing)

## Troubleshooting

### Error: "GOOGLE_CLOUD_PROJECT_ID is required"
- Make sure you've set the environment variable
- Check that it matches your actual GCP project ID

### Error: "Authentication failed"
- Verify your service account has the correct permissions
- Check that your access token is valid (they expire)
- Ensure `GOOGLE_APPLICATION_CREDENTIALS` points to a valid JSON file

### Error: "API not enabled"
- Go to APIs & Services > Library
- Enable "Vertex AI API"
- Wait a few minutes for propagation

### Error: "Model not found"
- Verify the model name: `veo-3.1-generate-preview` or `gemini-2.5-flash-image-preview`
- Check that the model is available in your region
- Some models may be in preview and require allowlist access

## Next Steps

1. **Test with a simple prompt** to verify authentication works
2. **Integrate into video generator component** - update UI to show Veo 3 option
3. **Monitor costs** - set up billing alerts in GCP
4. **Optimize prompts** - use persona character_bible data for better results

## Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Veo 3 Prompting Guide](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)
- [Google Cloud Authentication](https://cloud.google.com/docs/authentication)

