# Setting Up Environment Variables in Vercel

## Current Issue

The error shows: `GOOGLE_CLOUD_PROJECT_ID environment variable is required`

This means the environment variable is set locally but not in Vercel.

## How to Add Environment Variables in Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to your Vercel project:**
   - Visit [vercel.com](https://vercel.com)
   - Navigate to your project: `synthetic-user-testing`

2. **Open Project Settings:**
   - Click on your project
   - Go to **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add Required Variables:**
   
   **For Veo 3 Video Generation:**
   ```
   GOOGLE_CLOUD_PROJECT_ID = synth-users
   GOOGLE_CLOUD_LOCATION = us-central1
   ```
   
   **For Authentication (choose one):**
   
   **Option A: Service Account (Recommended for Production)**
   ```
   GOOGLE_APPLICATION_CREDENTIALS = <paste entire service account JSON>
   ```
   
   **Option B: Access Token (Temporary - expires in 1 hour)**
   ```
   GOOGLE_CLOUD_ACCESS_TOKEN = <your-access-token>
   ```

4. **Set Environment:**
   - Select which environments to apply to:
     - ✅ Production
     - ✅ Preview
     - ✅ Development (optional)

5. **Save and Redeploy:**
   - Click **Save**
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment (or it will auto-redeploy on next push)

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Add environment variables
vercel env add GOOGLE_CLOUD_PROJECT_ID production
# Enter: synth-users

vercel env add GOOGLE_CLOUD_LOCATION production
# Enter: us-central1

# For service account (recommended)
vercel env add GOOGLE_APPLICATION_CREDENTIALS production
# Paste your service account JSON

# Pull environment variables to verify
vercel env pull .env.local
```

## Required Environment Variables for Veo 3

| Variable | Value | Required |
|----------|-------|----------|
| `GOOGLE_CLOUD_PROJECT_ID` | `synth-users` | ✅ Yes |
| `GOOGLE_CLOUD_LOCATION` | `us-central1` | ⚠️ Optional (defaults to us-central1) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Service account JSON | ✅ Yes (for production) |
| OR `GOOGLE_CLOUD_ACCESS_TOKEN` | Access token | ⚠️ Temporary only |

## Setting Up Service Account for Vercel

Since ADC (Application Default Credentials) doesn't work on Vercel, you need a service account:

1. **Create Service Account:**
   ```bash
   gcloud iam service-accounts create synth-users-api \
     --display-name="Synthetic Users API Service Account" \
     --project=synth-users
   ```

2. **Grant Permissions:**
   ```bash
   gcloud projects add-iam-policy-binding synth-users \
     --member="serviceAccount:synth-users-api@synth-users.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"
   ```

3. **Create and Download Key:**
   ```bash
   gcloud iam service-accounts keys create key.json \
     --iam-account=synth-users-api@synth-users.iam.gserviceaccount.com
   ```

4. **Add to Vercel:**
   - Copy the entire contents of `key.json`
   - Paste into Vercel's `GOOGLE_APPLICATION_CREDENTIALS` environment variable
   - **Important:** Paste as a single-line JSON string (Vercel will handle it)

## Verify Setup

After adding variables and redeploying:

1. Check deployment logs in Vercel
2. Look for: `"hasVeo3: true"` in the logs
3. Try generating a video - should see Veo 3 API errors (not "not configured" error)

## Troubleshooting

**"GOOGLE_CLOUD_PROJECT_ID environment variable is required"**
- ✅ Variable not set in Vercel
- ✅ Set it in Vercel dashboard and redeploy

**"Authentication failed"**
- ✅ Check service account has `roles/aiplatform.user` permission
- ✅ Verify JSON is valid and complete
- ✅ Ensure Vertex AI API is enabled

**"Model not found"**
- ✅ Veo 3 may require allowlist access
- ✅ Check if model name is correct: `veo-3.1-generate-preview`
- ✅ Verify model is available in your region

