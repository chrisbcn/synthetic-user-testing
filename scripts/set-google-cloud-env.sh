#!/bin/bash
# Script to set Google Cloud environment variables in Vercel
# Matching RENOIR wardrobe project pattern

set -e

echo "🔧 Setting up Google Cloud environment variables in Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

echo "✅ Vercel CLI ready"
echo ""

# Set basic variables
echo "📝 Setting basic Google Cloud variables..."

vercel env add GOOGLE_CLOUD_PROJECT_ID production preview development <<< "synth-users" 2>/dev/null || echo "  (already set)"
vercel env add GOOGLE_CLOUD_LOCATION production preview development <<< "us-central1" 2>/dev/null || echo "  (already set)"

echo ""
echo "🔑 Now setting service account credentials..."
echo ""
echo "⚠️  You'll need to provide these values from your service account JSON:"
echo "   - GOOGLE_CLIENT_EMAIL"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_PRIVATE_KEY"
echo "   - GOOGLE_PRIVATE_KEY_ID (optional)"
echo ""

# Check if we have a service account JSON file
if [ -f "service-account-key.json" ]; then
    echo "📄 Found service-account-key.json, extracting values..."
    
    CLIENT_EMAIL=$(cat service-account-key.json | jq -r '.client_email')
    CLIENT_ID=$(cat service-account-key.json | jq -r '.client_id')
    PRIVATE_KEY=$(cat service-account-key.json | jq -r '.private_key')
    PRIVATE_KEY_ID=$(cat service-account-key.json | jq -r '.private_key_id')
    
    echo "  Setting GOOGLE_CLIENT_EMAIL..."
    echo "$CLIENT_EMAIL" | vercel env add GOOGLE_CLIENT_EMAIL production preview development 2>/dev/null || echo "    (already set)"
    
    echo "  Setting GOOGLE_CLIENT_ID..."
    echo "$CLIENT_ID" | vercel env add GOOGLE_CLIENT_ID production preview development 2>/dev/null || echo "    (already set)"
    
    echo "  Setting GOOGLE_PRIVATE_KEY..."
    echo "$PRIVATE_KEY" | vercel env add GOOGLE_PRIVATE_KEY production preview development 2>/dev/null || echo "    (already set)"
    
    echo "  Setting GOOGLE_PRIVATE_KEY_ID..."
    echo "$PRIVATE_KEY_ID" | vercel env add GOOGLE_PRIVATE_KEY_ID production preview development 2>/dev/null || echo "    (already set)"
    
    echo ""
    echo "✅ Service account credentials set!"
else
    echo "⚠️  No service-account-key.json found."
    echo ""
    echo "Please either:"
    echo "  1. Place your service account JSON file as 'service-account-key.json' in the project root"
    echo "  2. Or run this script and enter values manually when prompted"
    echo ""
    echo "Setting up manual entry..."
    
    echo ""
    read -p "Enter GOOGLE_CLIENT_EMAIL: " CLIENT_EMAIL
    echo "$CLIENT_EMAIL" | vercel env add GOOGLE_CLIENT_EMAIL production preview development
    
    read -p "Enter GOOGLE_CLIENT_ID: " CLIENT_ID
    echo "$CLIENT_ID" | vercel env add GOOGLE_CLIENT_ID production preview development
    
    echo "Enter GOOGLE_PRIVATE_KEY (paste the entire key, including BEGIN/END lines):"
    read -p "> " PRIVATE_KEY
    echo "$PRIVATE_KEY" | vercel env add GOOGLE_PRIVATE_KEY production preview development
    
    read -p "Enter GOOGLE_PRIVATE_KEY_ID (optional, press Enter to skip): " PRIVATE_KEY_ID
    if [ ! -z "$PRIVATE_KEY_ID" ]; then
        echo "$PRIVATE_KEY_ID" | vercel env add GOOGLE_PRIVATE_KEY_ID production preview development
    fi
fi

echo ""
echo "✅ All environment variables set!"
echo ""
echo "📋 Summary:"
echo "   ✅ GOOGLE_CLOUD_PROJECT_ID = synth-users"
echo "   ✅ GOOGLE_CLOUD_LOCATION = us-central1"
echo "   ✅ GOOGLE_CLIENT_EMAIL = (set)"
echo "   ✅ GOOGLE_CLIENT_ID = (set)"
echo "   ✅ GOOGLE_PRIVATE_KEY = (set)"
if [ ! -z "$PRIVATE_KEY_ID" ]; then
    echo "   ✅ GOOGLE_PRIVATE_KEY_ID = (set)"
fi
echo ""
echo "🚀 Next steps:"
echo "   1. Redeploy your Vercel project (or wait for auto-deploy)"
echo "   2. Test Nano Banana image generation"
echo "   3. Test Veo 3 video generation (if you have access)"
echo ""

