# How to Get Google Cloud Access Token

There are several ways to authenticate with Google Cloud depending on your setup:

## ⭐ Method 1: Application Default Credentials (ADC) - Recommended for Local Development

**This is the easiest and most reliable method for local development!**

```bash
# Install gcloud CLI if you haven't (macOS)
brew install google-cloud-sdk

# Authenticate with Application Default Credentials
gcloud auth application-default login

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

**That's it!** The app will automatically use these credentials. No access token needed in your `.env.local` file.

**Your `.env.local` only needs:**
```bash
GOOGLE_CLOUD_PROJECT_ID=synth-users
GOOGLE_CLOUD_LOCATION=us-central1
```

The credentials are stored at `~/.config/gcloud/application_default_credentials.json` and automatically refresh as needed.

## Method 2: Using gcloud CLI (For Quick Testing)

If you have the Google Cloud SDK installed:

```bash
# Install gcloud CLI if you haven't (macOS)
brew install google-cloud-sdk

# Authenticate
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Get access token (valid for 1 hour)
gcloud auth print-access-token
```

**For Vercel/Production:** This won't work since you can't run gcloud commands. Use Method 3 (Service Account) instead.

## Method 3: Service Account (Recommended for Production)

This is the best approach for production deployments like Vercel:

### Step 1: Create Service Account

1. Go to [Google Cloud Console > IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click **"Create Service Account"**
3. Name it (e.g., `synth-users-api`)
4. Click **"Create and Continue"**

### Step 2: Grant Permissions

1. Add role: **"Vertex AI User"** (or `roles/aiplatform.user`)
2. Click **"Continue"** then **"Done"**

### Step 3: Create and Download Key

1. Click on your new service account
2. Go to **"Keys"** tab
3. Click **"Add Key"** > **"Create new key"**
4. Choose **JSON** format
5. Download the JSON file

### Step 4: Use the Key

**Option A: For Local Development**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/downloaded-key.json"
```

**Option B: For Vercel**
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add a new variable:
   - **Name:** `GOOGLE_APPLICATION_CREDENTIALS`
   - **Value:** Copy the entire contents of the JSON file (as a single-line string, or use Vercel's JSON env var feature)

**Option C: Extract Access Token from Service Account**
If you need just the token (not recommended for production):

```bash
# Using gcloud with service account
gcloud auth activate-service-account --key-file=/path/to/key.json
gcloud auth print-access-token
```

## Method 3: Application Default Credentials (ADC) - For Local Dev

If you're running locally and have gcloud installed:

```bash
# Authenticate with your Google account
gcloud auth application-default login

# This will:
# 1. Open browser for authentication
# 2. Store credentials locally
# 3. No need to set GOOGLE_CLOUD_ACCESS_TOKEN env var
```

The app will automatically use these credentials - no token needed!

## Method 4: Generate Access Token Programmatically (For Testing)

If you need to generate a token programmatically:

```bash
# Using gcloud
gcloud auth print-access-token

# Or using curl (if you have client_id and client_secret)
curl -X POST https://oauth2.googleapis.com/token \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "refresh_token=YOUR_REFRESH_TOKEN" \
  -d "grant_type=refresh_token"
```

## For Vercel Deployment (Recommended)

**Best Practice:** Use Service Account JSON

1. Create service account (see Method 2 above)
2. Download JSON key
3. In Vercel:
   - Go to Project Settings > Environment Variables
   - Add `GOOGLE_APPLICATION_CREDENTIALS` with the JSON content
   - Or add individual fields if Vercel supports it

**Alternative:** If you must use access token:
1. Generate token locally: `gcloud auth print-access-token`
2. Copy the token
3. Add to Vercel as `GOOGLE_CLOUD_ACCESS_TOKEN`
4. **Note:** Tokens expire after 1 hour, so you'll need to refresh regularly

## Quick Test

Once you have credentials set up, test with:

```bash
# Test Veo 3
curl -X POST http://localhost:3000/api/video/veo3 \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A professional person speaking to camera",
    "responseText": "This is a test quote"
  }'
```

## Troubleshooting

**"Missing PROJECT_ID"**
- Set `GOOGLE_CLOUD_PROJECT_ID` to your actual project ID (not project name)

**"Authentication failed"**
- Verify your service account has `roles/aiplatform.user` permission
- Check that Vertex AI API is enabled
- Ensure token hasn't expired (if using access token)

**"Model not found"**
- Some models may require allowlist access
- Check that Veo 3 is available in your region
- Verify model name: `veo-3.1-generate-preview`

## Security Notes

⚠️ **Never commit service account keys or access tokens to git!**

- Add `*.json` (service account keys) to `.gitignore`
- Use environment variables only
- Rotate keys regularly
- Use least-privilege permissions

