# Veo 3 Access and Troubleshooting

## Model Names

As of July 2025, Veo 3 is generally available with these model IDs:
- **Veo 3 Standard:** `veo-3.0-generate-001`
- **Veo 3 Fast:** `veo-3.0-fast-generate-001`

The `-preview` versions (`veo-3.0-generate-preview`) may still require allowlist access.

## 404 Error: Model Not Found

If you get a 404 error saying the model is not found, try these steps:

### 1. Verify Model Availability

Check if Veo 3 is available in your project:

```bash
# List available models
gcloud ai models list --region=us-central1 --project=synth-users

# Or check Model Garden in Console
# Go to: Vertex AI > Model Garden > Search "Veo 3"
```

### 2. Request Allowlist Access (if needed)

Even though Veo 3 is "generally available," some projects may still need allowlist access:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Vertex AI** > **Model Garden**
3. Search for "Veo 3"
4. Click "Apply for access" or "Request access" if available
5. Complete the application form

### 3. Verify IAM Permissions

Ensure your service account has the necessary permissions:

```bash
# Check service account roles
gcloud projects get-iam-policy synth-users \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:*"

# Required role: roles/aiplatform.user
```

### 4. Enable Vertex AI API

Make sure Vertex AI API is enabled:

```bash
# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com --project=synth-users

# Verify it's enabled
gcloud services list --enabled --project=synth-users | grep aiplatform
```

### 5. Try Different Model Names

Set environment variable to try different models:

```bash
# In Vercel or .env.local:
VERTEX_AI_MODEL_VEO3=veo-3.0-generate-001
# Or
VERTEX_AI_MODEL_VEO3=veo-3.0-fast-generate-001
# Or (if you have preview access)
VERTEX_AI_MODEL_VEO3=veo-3.0-generate-preview
```

### 6. Check Region Availability

Veo 3 might not be available in all regions. Try:

```bash
# Check if available in us-central1
# Or try us-east1, us-west1, etc.
GOOGLE_CLOUD_LOCATION=us-east1
```

## Common Issues

### Issue: 404 Not Found
**Cause:** Model not available in project or requires allowlist  
**Solution:** Request access via Model Garden or use `veo-3.0-generate-001`

### Issue: 403 Permission Denied
**Cause:** Missing IAM permissions  
**Solution:** Grant `roles/aiplatform.user` to service account

### Issue: 400 Invalid Request
**Cause:** Wrong API endpoint or payload format  
**Solution:** Verify endpoint uses `:generateContent` suffix

## Testing Access

Test if Veo 3 is accessible:

```bash
# Get access token
TOKEN=$(gcloud auth print-access-token)

# Try to call the API directly
curl -X POST \
  "https://us-central1-aiplatform.googleapis.com/v1/projects/synth-users/locations/us-central1/publishers/google/models/veo-3.0-generate-001:generateContent" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "A professional person speaking to camera"
      }]
    }]
  }'
```

If this works, the issue is with the app configuration. If it fails, the issue is with Google Cloud access.

## Support

If none of these steps work:
1. Check [Google Cloud Status](https://status.cloud.google.com/)
2. Contact Google Cloud Support
3. Check [Vertex AI Release Notes](https://cloud.google.com/vertex-ai/docs/release-notes)

