#!/bin/bash
# Script to set up Vercel environment variables for Google Cloud

echo "Setting up Vercel environment variables for Google Cloud..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Install it with: npm i -g vercel"
    exit 1
fi

# Set project ID
echo "Setting GOOGLE_CLOUD_PROJECT_ID..."
vercel env add GOOGLE_CLOUD_PROJECT_ID production <<< "synth-users"
vercel env add GOOGLE_CLOUD_PROJECT_ID preview <<< "synth-users"

# Set location
echo "Setting GOOGLE_CLOUD_LOCATION..."
vercel env add GOOGLE_CLOUD_LOCATION production <<< "us-central1"
vercel env add GOOGLE_CLOUD_LOCATION preview <<< "us-central1"

echo ""
echo "✅ Environment variables set!"
echo ""
echo "⚠️  IMPORTANT: You still need to set up authentication:"
echo "   1. Create a service account in Google Cloud"
echo "   2. Add GOOGLE_APPLICATION_CREDENTIALS to Vercel with the service account JSON"
echo ""
echo "See docs/VERCEL_ENV_SETUP.md for detailed instructions."

