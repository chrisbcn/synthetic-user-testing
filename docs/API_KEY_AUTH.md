# Using API Key Authentication for Vertex AI

## Overview

API keys are the **simplest** way to authenticate with Vertex AI. They're easier to set up than service accounts and work great for development and testing.

## Getting Your API Key

1. Go to [Vertex AI Studio](https://console.cloud.google.com/vertex-ai/studio)
2. Click **"Get API key"** in the left sidebar (or the key icon)
3. Click **"+ Create API Key"**
4. Copy the generated API key (starts with `AQ.`)

## Setting Up the API Key

### Option 1: Environment Variable (Recommended)

Add to your `.env.local` (local) or Vercel environment variables:

```bash
GOOGLE_CLOUD_API_KEY=AQ.Ab8RN6KrMhv1118_mzWQn0hXxrirKOQSPpmmXdnpBFhfDcCltA
```

Or use the alternative name:

```bash
VERTEX_AI_API_KEY=AQ.Ab8RN6KrMhv1118_mzWQn0hXxrirKOQSPpmmXdnpBFhfDcCltA
```

### Option 2: Vercel Environment Variables

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - **Name:** `GOOGLE_CLOUD_API_KEY`
   - **Value:** Your API key (starts with `AQ.`)
4. Redeploy your application

## How It Works

When an API key is set, the app will:
1. Add the API key as a query parameter: `?key=YOUR_API_KEY`
2. Skip OAuth2 Bearer token authentication
3. Use the simpler API key authentication method

## Priority Order

The app tries authentication methods in this order:

1. **API Key** (`GOOGLE_CLOUD_API_KEY` or `VERTEX_AI_API_KEY`) - ✅ Simplest
2. Access Token (`GOOGLE_CLOUD_ACCESS_TOKEN`)
3. Service Account JSON (`GOOGLE_APPLICATION_CREDENTIALS`)
4. Service Account Fields (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, etc.)
5. Application Default Credentials (ADC)

## Advantages of API Keys

- ✅ **Simple setup** - Just copy/paste the key
- ✅ **No service account configuration needed**
- ✅ **Works immediately** - No token refresh needed
- ✅ **Great for development** - Easy to test locally

## Security Notes

⚠️ **Important:**
- API keys are less secure than OAuth2 tokens
- They can't be scoped as precisely as service accounts
- **Never commit API keys to git** - use environment variables
- Consider restricting API key usage in Google Cloud Console:
  - Go to **APIs & Services** > **Credentials**
  - Click on your API key
  - Set **Application restrictions** (e.g., HTTP referrers, IP addresses)
  - Set **API restrictions** (limit to Vertex AI API only)

## Testing

After setting the API key, try generating a video. The app will automatically use the API key if it's available.

Check the server logs to see which authentication method is being used:
- `Using API key authentication` = API key is being used
- `Using access token from...` = OAuth2 token is being used

## Troubleshooting

### API Key Not Working

1. **Verify the key is set:**
   ```bash
   echo $GOOGLE_CLOUD_API_KEY
   ```

2. **Check for typos** - API keys start with `AQ.`

3. **Verify API restrictions** - Make sure Vertex AI API is enabled for the key

4. **Check project ID** - Still need `GOOGLE_CLOUD_PROJECT_ID` set

### Still Getting 401/403 Errors

- API key might be restricted
- Check API key restrictions in Google Cloud Console
- Try regenerating the API key
- Fall back to service account authentication if needed

## Next Steps

Once your API key is set:
1. Set `GOOGLE_CLOUD_PROJECT_ID` (still required)
2. Set `GOOGLE_CLOUD_LOCATION` (optional, defaults to `us-central1`)
3. Try generating a video!

The API key will be automatically used for all Vertex AI API calls (Veo 3, Nano Banana, etc.).

