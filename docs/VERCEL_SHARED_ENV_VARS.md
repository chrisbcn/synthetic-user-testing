# Sharing Environment Variables in Vercel

## Overview

Vercel allows you to share environment variables at the **Team level**, so multiple projects can use the same credentials. This is perfect for sharing Google Cloud service account credentials between RENOIR and this project.

## How to Set Up Shared Environment Variables

### Step 1: Go to Team Settings

1. In Vercel Dashboard, click on your **Team** name (top left)
2. Go to **Settings** → **Environment Variables**
3. Or go directly to: `https://vercel.com/[your-team]/settings/environment-variables`

### Step 2: Add Shared Variables

1. Click **"Add New"** or **"Create Variable"**
2. Add each Google Cloud credential:

```
GOOGLE_CLOUD_PROJECT_ID = synth-users
GOOGLE_CLOUD_LOCATION = us-central1
GOOGLE_CLIENT_EMAIL = <from service account JSON>
GOOGLE_CLIENT_ID = <from service account JSON>
GOOGLE_PRIVATE_KEY = <from service account JSON>
GOOGLE_PRIVATE_KEY_ID = <from service account JSON> (optional)
```

3. **Important:** Select **"All Environments"** (Production, Preview, Development)
4. Click **"Save"**

### Step 3: Link to Projects

Shared variables are automatically inherited by all projects in your team. However, you can also:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. You'll see a section for **"Shared Environment Variables"**
4. They should appear automatically if set at team level

## Benefits

✅ **Single source of truth** - Update credentials once, all projects get them  
✅ **Consistency** - Same credentials across RENOIR and synthetic-user-testing  
✅ **Easier management** - No need to duplicate credentials in each project  
✅ **Security** - Centralized credential management

## Which Variables to Share

**Share these (same across projects):**
- `GOOGLE_CLOUD_PROJECT_ID` - Same Google Cloud project
- `GOOGLE_CLOUD_LOCATION` - Same region
- `GOOGLE_CLIENT_EMAIL` - Same service account
- `GOOGLE_CLIENT_ID` - Same service account
- `GOOGLE_PRIVATE_KEY` - Same service account
- `GOOGLE_PRIVATE_KEY_ID` - Same service account

**Keep project-specific (don't share):**
- `ANTHROPIC_API_KEY` - May differ per project
- `BLOB_READ_WRITE_TOKEN` - Project-specific storage
- `SUPABASE_URL` - Project-specific database
- Any other project-specific variables

## Verifying Shared Variables

1. Go to your project → **Settings** → **Environment Variables**
2. Scroll down to **"Shared Environment Variables"** section
3. You should see the shared variables listed there
4. They'll be marked as "Shared" or show a team icon

## Updating Shared Variables

1. Go to **Team Settings** → **Environment Variables**
2. Find the variable you want to update
3. Click **"Edit"**
4. Update the value
5. Click **"Save"**
6. All projects will automatically get the updated value (may need redeploy)

## Troubleshooting

**Variables not showing up?**
- Make sure you're in the correct team
- Check that variables are set to "All Environments"
- Try redeploying the project

**Want to override a shared variable?**
- You can add a project-specific variable with the same name
- Project-specific variables take precedence over shared ones

## Example Setup

**Team Level (Shared):**
```
GOOGLE_CLOUD_PROJECT_ID=synth-users
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_CLIENT_EMAIL=vertex-express@synth-users.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=123456789012345678901
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
GOOGLE_PRIVATE_KEY_ID=abc123def456...
```

**Project Level (Specific to synthetic-user-testing):**
```
ANTHROPIC_API_KEY=sk-ant-...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

This way, both RENOIR and synthetic-user-testing can use the same Google Cloud credentials without duplication!

