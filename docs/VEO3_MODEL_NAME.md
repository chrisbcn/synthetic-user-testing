# Veo 3 Model Name Issue

## ✅ Correct Model Name

From Vertex AI Model Garden:
- **Model ID:** `publishers/google/models/veo-3.0-generate-preview`
- **Version name:** `google/veo-3.0-generate-preview`
- **Model name to use:** `veo-3.0-generate-preview`

The code now uses `veo-3.0-generate-preview` as the default.

You can override via environment variable:
```bash
VERTEX_AI_MODEL_VEO3=veo-3.0-generate-preview
```

### 2. Veo 3 May Require Allowlist Access

Veo 3 is a preview/pre-release model and may require:
- **Allowlist access** - Contact Google Cloud support
- **Early access program** enrollment
- **Special project configuration**

### 3. Check Available Models

List available models in your project:
```bash
# List all Vertex AI models
gcloud ai models list --region=us-central1 --project=synth-users

# Or check via API
curl -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://us-central1-aiplatform.googleapis.com/v1/projects/synth-users/locations/us-central1/models"
```

### 4. Verify Veo 3 Availability

Veo 3 might not be available in:
- Your region (`us-central1`)
- Your project (needs allowlist)
- Your account (needs early access)

Check Google Cloud Console:
1. Go to **Vertex AI** > **Model Garden**
2. Search for "Veo" or "Veo 3"
3. Check if it's available/requires access request

### 5. Alternative: Use Different Endpoint

Veo 3 might use a different API endpoint structure. Check:
- Google Cloud documentation for Veo 3
- Vertex AI API reference
- Model Garden for correct endpoint format

## Next Steps

1. **Try `veo-3-generate`** (updated in code)
2. **Check Model Garden** in Google Cloud Console
3. **Contact Google Cloud Support** if Veo 3 requires allowlist
4. **Check if Veo 3 is available** in your region/project

## Temporary Workaround

Until Veo 3 is available, the app will fall back to:
- Runway ML (if `RUNWAY_API_KEY` is set)
- Prompt generation (using Gemini API)

