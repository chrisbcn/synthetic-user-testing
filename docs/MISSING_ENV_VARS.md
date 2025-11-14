# Missing Environment Variables for Veo 3 & Nano Banana

## Current Status

You have:
- ✅ `GOOGLE_CLOUD_PROJECT_ID` = `synth-users`
- ✅ `GOOGLE_CLOUD_LOCATION` = `us-central1`

## ❌ Missing: Authentication

You're missing authentication credentials. Choose **ONE** of these options:

### Option 1: Individual Service Account Fields (Like Renoir Project) ✅ Recommended

This matches what you have in the Renoir wardrobe project. Add these to Vercel:

```
GOOGLE_CLIENT_ID = <from service account JSON>
GOOGLE_CLIENT_EMAIL = <from service account JSON>
GOOGLE_PRIVATE_KEY_ID = <from service account JSON> (optional)
GOOGLE_PRIVATE_KEY = <from service account JSON>
```

**How to get these values:**
1. Go to [Google Cloud Console > IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=synth-users)
2. Find or create a service account
3. Create a new key (JSON format)
4. Download the JSON file
5. Extract these fields from the JSON:
   - `client_id` → `GOOGLE_CLIENT_ID`
   - `client_email` → `GOOGLE_CLIENT_EMAIL`
   - `private_key_id` → `GOOGLE_PRIVATE_KEY_ID` (optional)
   - `private_key` → `GOOGLE_PRIVATE_KEY` (keep the `\n` characters or replace with actual newlines)

### Option 2: Full Service Account JSON

Add this single variable:

```
GOOGLE_APPLICATION_CREDENTIALS = <paste entire JSON as single-line string>
```

### Option 3: Access Token (Temporary - Not Recommended)

```
GOOGLE_CLOUD_ACCESS_TOKEN = <token from gcloud auth print-access-token>
```

⚠️ **Note:** Access tokens expire after 1 hour. Use Option 1 or 2 for production.

## Optional: Model-Specific Variables (Like Renoir)

If you want to match Renoir's setup exactly, you can also add:

```
VERTEX_AI_MODEL_VISION = <model name for vision tasks>
VERTEX_AI_STORAGE_BUCKET = <GCS bucket for storage>
```

These are optional - Veo 3 and Nano Banana will work without them.

## Summary

**Minimum Required:**
- ✅ `GOOGLE_CLOUD_PROJECT_ID` (you have this)
- ✅ `GOOGLE_CLOUD_LOCATION` (you have this)
- ❌ **Authentication** (choose Option 1, 2, or 3 above)

**Recommended Setup (matching Renoir):**
```
GOOGLE_CLOUD_PROJECT_ID = synth-users
GOOGLE_CLOUD_LOCATION = us-central1
GOOGLE_CLIENT_ID = <from service account>
GOOGLE_CLIENT_EMAIL = <from service account>
GOOGLE_PRIVATE_KEY = <from service account>
```

## Quick Setup Script

If you have a service account JSON file:

```bash
# Extract values from service account JSON
cat service-account-key.json | jq -r '.client_id'      # → GOOGLE_CLIENT_ID
cat service-account-key.json | jq -r '.client_email'  # → GOOGLE_CLIENT_EMAIL
cat service-account-key.json | jq -r '.private_key'    # → GOOGLE_PRIVATE_KEY
```

Then add these to Vercel environment variables.

