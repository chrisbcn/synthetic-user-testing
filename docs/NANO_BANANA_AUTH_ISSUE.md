# Nano Banana Authentication Issue - Review for Tomorrow

## Current Error

```
401 - UNAUTHENTICATED
"Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential."
"ACCESS_TOKEN_TYPE_UNSUPPORTED"
```

## What We Have Set Up

✅ **API Key Created**: `GOOGLE_CLOUD_API_KEY` is set in Vercel  
✅ **Project ID**: `GOOGLE_CLOUD_PROJECT_ID=synth-users`  
✅ **Location**: `GOOGLE_CLOUD_LOCATION=us-central1`  
✅ **Vertex AI API**: Enabled in Google Cloud Console  
✅ **Code Updated**: Nano Banana route uses API key authentication

## The Problem

**API Keys vs OAuth2 Tokens:**
- **API Keys** (`GOOGLE_CLOUD_API_KEY`) work with **Gemini API** endpoints (`generativelanguage.googleapis.com`)
- **OAuth2 Tokens** work with **Vertex AI** endpoints (`aiplatform.googleapis.com`)

**Current Code Issue:**
- We're using `buildVertexAIEndpoint()` which creates: `https://us-central1-aiplatform.googleapis.com/...`
- This is a **Vertex AI endpoint** which requires **OAuth2 tokens**, NOT API keys
- API keys don't work with Vertex AI endpoints

## What's Missing

### Option 1: Use OAuth2 Token Instead of API Key
- Need to set up service account authentication
- Or use `GOOGLE_CLOUD_ACCESS_TOKEN` (but this expires)
- Or use Application Default Credentials (ADC) - works locally, not on Vercel

### Option 2: Use Gemini API Endpoint (If Nano Banana Supports It)
- Check if Nano Banana is available via Gemini API
- Use endpoint: `https://generativelanguage.googleapis.com/...`
- API keys would work with this endpoint

### Option 3: Verify Nano Banana Model Name
- Current model: `gemini-2.5-flash-image-preview`
- Verify this is the correct model name for Vertex AI
- Check if it's available in Model Garden

## Questions to Answer Tomorrow

1. **Does Nano Banana support API keys?**
   - Check Google Cloud documentation
   - Check if it's available via Gemini API vs Vertex AI only

2. **What authentication method should we use?**
   - Service account JSON (like we have for Veo 3)?
   - Or can we use API keys with a different endpoint?

3. **Is the model name correct?**
   - `gemini-2.5-flash-image-preview` - verify in Model Garden

4. **Do we need to enable additional APIs?**
   - Vertex AI API is enabled
   - Do we need Gemini API enabled too?

## Current Code Location

- **Route**: `app/api/image/nano-banana/route.ts`
- **Endpoint Builder**: `lib/google-cloud.ts` → `buildVertexAIEndpoint()`
- **Auth**: Currently tries API key first, then falls back to OAuth2

## Recommended Fixes

### Fix 1: Add Service Account Support (Like Veo 3)
If Nano Banana requires Vertex AI (OAuth2), we need:
```bash
GOOGLE_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_CLIENT_ID=...
```

### Fix 2: Check if Gemini API Endpoint Works
Try using Gemini API endpoint instead:
```typescript
// Instead of Vertex AI endpoint
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`
```

### Fix 3: Verify Model Availability
- Go to Vertex AI Model Garden
- Search for "Nano Banana" or "Gemini 2.5 Flash Image"
- Verify the exact model name and endpoint

## Next Steps

1. **Check Google Cloud Console:**
   - Verify Nano Banana is available in Model Garden
   - Check what authentication it requires
   - See if there's a Gemini API alternative

2. **Review Documentation:**
   - Google Cloud Vertex AI docs for Nano Banana
   - Check if API keys are supported or only OAuth2

3. **Test Authentication:**
   - Try with service account credentials (like Veo 3)
   - Or try Gemini API endpoint with API key

4. **Update Code:**
   - Fix authentication method based on findings
   - Update endpoint if needed
   - Test image generation

## Related Files

- `app/api/image/nano-banana/route.ts` - Main route
- `lib/google-cloud.ts` - Authentication utilities
- `docs/API_KEY_AUTH.md` - API key documentation
- `docs/GOOGLE_CLOUD_SETUP.md` - Service account setup guide

