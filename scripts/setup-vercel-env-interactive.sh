#!/bin/bash
# Interactive script to set Google Cloud environment variables in Vercel
# This will guide you through setting up all required variables

set -e

echo "🚀 Vercel Environment Variable Setup"
echo "===================================="
echo ""
echo "This script will help you set up Google Cloud environment variables"
echo "for Vertex AI (Nano Banana, Veo 3) matching RENOIR wardrobe project."
echo ""

# Check if vercel CLI is available (try npx first, then global)
VERCEL_CMD="vercel"
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found globally, using npx..."
    VERCEL_CMD="npx vercel"
fi

# Check if logged in
echo "🔐 Checking Vercel authentication..."
if ! $VERCEL_CMD whoami &> /dev/null; then
    echo "Please log in to Vercel..."
    $VERCEL_CMD login
fi

echo "✅ Logged in as: $($VERCEL_CMD whoami)"
echo ""

# Set basic variables
echo "📝 Setting basic variables..."
echo "synth-users" | $VERCEL_CMD env add GOOGLE_CLOUD_PROJECT_ID production preview development 2>/dev/null || echo "  ✓ Already set"
echo "us-central1" | $VERCEL_CMD env add GOOGLE_CLOUD_LOCATION production preview development 2>/dev/null || echo "  ✓ Already set"

echo ""
echo "🔑 Service Account Credentials"
echo "=============================="
echo ""
echo "We need your Google Cloud service account credentials."
echo "These should match what you use in RENOIR wardrobe project."
echo ""

# Try to get from RENOIR project
RENOIR_DIR="/Users/chrisbasey/Documents/GitHub/renoir-wardrobe"
if [ -d "$RENOIR_DIR" ]; then
    echo "📂 Found RENOIR project. Checking for service account file..."
    if [ -f "$RENOIR_DIR/service-account-key.json" ]; then
        echo "✅ Found service account JSON in RENOIR project!"
        read -p "Use these credentials? (y/n): " USE_RENOIR
        if [ "$USE_RENOIR" = "y" ] || [ "$USE_RENOIR" = "Y" ]; then
            CLIENT_EMAIL=$(cat "$RENOIR_DIR/service-account-key.json" | jq -r '.client_email')
            CLIENT_ID=$(cat "$RENOIR_DIR/service-account-key.json" | jq -r '.client_id')
            PRIVATE_KEY=$(cat "$RENOIR_DIR/service-account-key.json" | jq -r '.private_key')
            PRIVATE_KEY_ID=$(cat "$RENOIR_DIR/service-account-key.json" | jq -r '.private_key_id')
            
            echo ""
            echo "📤 Setting credentials from RENOIR..."
            echo "$CLIENT_EMAIL" | $VERCEL_CMD env add GOOGLE_CLIENT_EMAIL production preview development 2>/dev/null || echo "  ✓ Already set"
            echo "$CLIENT_ID" | $VERCEL_CMD env add GOOGLE_CLIENT_ID production preview development 2>/dev/null || echo "  ✓ Already set"
            echo "$PRIVATE_KEY" | $VERCEL_CMD env add GOOGLE_PRIVATE_KEY production preview development 2>/dev/null || echo "  ✓ Already set"
            echo "$PRIVATE_KEY_ID" | $VERCEL_CMD env add GOOGLE_PRIVATE_KEY_ID production preview development 2>/dev/null || echo "  ✓ Already set"
            
            echo ""
            echo "✅ All credentials set from RENOIR project!"
            exit 0
        fi
    fi
fi

# Manual entry
echo ""
echo "Please provide your service account credentials:"
echo "(You can find these in your service account JSON file)"
echo ""

read -p "GOOGLE_CLIENT_EMAIL: " CLIENT_EMAIL
echo "$CLIENT_EMAIL" | $VERCEL_CMD env add GOOGLE_CLIENT_EMAIL production preview development

read -p "GOOGLE_CLIENT_ID: " CLIENT_ID
echo "$CLIENT_ID" | $VERCEL_CMD env add GOOGLE_CLIENT_ID production preview development

echo ""
echo "GOOGLE_PRIVATE_KEY (paste the entire key including BEGIN/END lines):"
echo "Press Enter after pasting, then Ctrl+D to finish:"
PRIVATE_KEY=$(cat)
echo "$PRIVATE_KEY" | $VERCEL_CMD env add GOOGLE_PRIVATE_KEY production preview development

read -p "GOOGLE_PRIVATE_KEY_ID (optional, press Enter to skip): " PRIVATE_KEY_ID
if [ ! -z "$PRIVATE_KEY_ID" ]; then
    echo "$PRIVATE_KEY_ID" | $VERCEL_CMD env add GOOGLE_PRIVATE_KEY_ID production preview development
fi

echo ""
echo "✅ All environment variables set!"
echo ""
echo "📋 Summary:"
$VERCEL_CMD env ls | grep GOOGLE || echo "  (Run '$VERCEL_CMD env ls' to see all variables)"
echo ""
echo "🚀 Next steps:"
echo "   1. Your project will auto-redeploy with new variables"
echo "   2. Or manually redeploy from Vercel dashboard"
echo "   3. Test Nano Banana image generation"
echo ""

