#!/bin/bash
# Script to extract service account credentials for Vercel

PROJECT_ID="synth-users"

echo "Service accounts in $PROJECT_ID:"
echo ""

# List all service accounts
gcloud iam service-accounts list --project=$PROJECT_ID --format="table(email,displayName)"

echo ""
echo "To create a new key for a service account, run:"
echo ""
echo "  gcloud iam service-accounts keys create key.json \\"
echo "    --iam-account=<SERVICE_ACCOUNT_EMAIL> \\"
echo "    --project=$PROJECT_ID"
echo ""
echo "Then extract values with:"
echo ""
echo "  cat key.json | jq -r '.client_id'      # → GOOGLE_CLIENT_ID"
echo "  cat key.json | jq -r '.client_email'   # → GOOGLE_CLIENT_EMAIL"
echo "  cat key.json | jq -r '.private_key'    # → GOOGLE_PRIVATE_KEY"
echo ""

