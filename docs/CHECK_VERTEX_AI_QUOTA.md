# How to Check Vertex AI Quota and Usage

## Check Quota in Google Cloud Console

1. **Go to Google Cloud Console:**
   - Navigate to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project: `synth-users`

2. **Check Vertex AI Quotas:**
   - Go to **IAM & Admin** > **Quotas**
   - Filter by service: **Vertex AI API**
   - Look for quotas related to:
     - `aiplatform.googleapis.com/generate_content` (for Veo 3)
     - Model-specific quotas

3. **Check Billing:**
   - Go to **Billing** > **Reports**
   - Filter by service: **Vertex AI API**
   - Check your usage and costs

## Check via gcloud CLI

```bash
# List all quotas for Vertex AI
gcloud alpha services quota list \
  --service=aiplatform.googleapis.com \
  --consumer=projects/synth-users

# Check specific quota
gcloud alpha services quota describe \
  --service=aiplatform.googleapis.com \
  --consumer=projects/synth-users \
  --metric=aiplatform.googleapis.com/generate_content
```

## Important Notes

- **Vertex AI** (`aiplatform.googleapis.com`) is different from **Gemini API** (`generativelanguage.googleapis.com`)
- Vertex AI uses pay-as-you-go billing (no free tier limits)
- Gemini API has free tier quotas that can be exhausted
- Make sure you're using Vertex AI endpoints, not Gemini API endpoints

## Current Issue

The error shows `generativelanguage.googleapis.com` (Gemini API), not `aiplatform.googleapis.com` (Vertex AI). This means:
- Veo 3 API call is failing
- Code is falling back to Gemini API
- Need to fix Veo 3 endpoint/authentication

## Verify Veo 3 API Access

1. **Check if Veo 3 is enabled:**
   ```bash
   gcloud services list --enabled --filter="name:aiplatform.googleapis.com"
   ```

2. **Check API access:**
   - Go to **APIs & Services** > **Enabled APIs**
   - Verify **Vertex AI API** is enabled

3. **Check permissions:**
   - Your service account or ADC needs `roles/aiplatform.user` role
   - Verify in **IAM & Admin** > **IAM**

## Enable Vertex AI API (if not enabled)

```bash
gcloud services enable aiplatform.googleapis.com --project=synth-users
```

