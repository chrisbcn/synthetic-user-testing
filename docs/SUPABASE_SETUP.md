# Supabase Setup for Persona Images

## Overview

Persona images are now stored in Supabase (matching RENOIR wardrobe project pattern). Images themselves are stored in Vercel Blob Storage, and the URLs are stored in Supabase.

## Using the Same Supabase Database as RENOIR

**Yes, you can use the same Supabase database!** Just create a new table for persona images.

### Option 1: Use Same Supabase Project (Recommended)

1. **Get Supabase credentials from RENOIR:**
   - Go to RENOIR's Vercel project
   - Check environment variables: `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - Or check Supabase dashboard: https://supabase.com/dashboard

2. **Add to this project's Vercel environment:**
   ```
   SUPABASE_URL = <same as RENOIR>
   SUPABASE_ANON_KEY = <same as RENOIR>
   ```

3. **Run the migration:**
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL from `supabase-migration-persona-images.sql`
   - This creates the `persona_images` table

### Option 2: Create New Supabase Project

If you prefer a separate database:

1. Create a new Supabase project at https://supabase.com
2. Get `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. Add to Vercel environment variables
4. Run the migration SQL

## Migration Steps

1. **Go to Supabase Dashboard:**
   - Navigate to your Supabase project
   - Go to **SQL Editor**

2. **Run the migration:**
   - Copy contents of `supabase-migration-persona-images.sql`
   - Paste into SQL Editor
   - Click **Run**

3. **Verify table created:**
   - Go to **Table Editor**
   - You should see `persona_images` table

## Environment Variables

Add these to Vercel (can be shared at Team level):

```bash
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Table Schema

The `persona_images` table has:
- `id` - Primary key (auto-increment)
- `persona_name` - Name of the persona (e.g., "Sophia Harrington")
- `image_url` - URL to the image (stored in Vercel Blob)
- `created_at` - Timestamp when image was added
- `updated_at` - Timestamp when record was last updated

## How It Works

1. **Image Generation:**
   - Nano Banana generates image → returns base64 data
   - Frontend uploads to Vercel Blob → gets URL
   - Frontend calls `/api/persona-images` with URL

2. **Storage:**
   - Image URL saved to Supabase `persona_images` table
   - Frontend loads images from Supabase on page load

3. **Benefits:**
   - ✅ Works on Vercel (no filesystem needed)
   - ✅ Persistent storage (survives deployments)
   - ✅ Can query/manage images via Supabase dashboard
   - ✅ Same database as RENOIR (if using same project)

## Troubleshooting

**"persona_images table does not exist"**
- Run the migration SQL in Supabase Dashboard

**"Supabase not configured"**
- Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel

**Images not loading**
- Check Supabase table has data
- Verify image URLs are valid
- Check browser console for errors

