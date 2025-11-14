# Supabase Troubleshooting

## "fetch failed" Error

If you're seeing `TypeError: fetch failed` when trying to connect to Supabase:

### 1. Check Environment Variables

The URL shown in the error (`djvlophsrdveawawixgx`) should match your Supabase project.

**Verify in Vercel:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Check `SUPABASE_URL` matches your Supabase project
3. Check `SUPABASE_ANON_KEY` is set correctly

**Expected format:**
- `SUPABASE_URL`: `https://xxxxx.supabase.co` (where xxxxx is your project ID)
- `SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long JWT token)

### 2. Test the Connection

Visit `/api/test-supabase` endpoint to see:
- Full Supabase URL being used
- Whether environment variables are set
- Direct REST API test results
- Detailed error information

### 3. Common Issues

**Wrong Supabase Project:**
- If the URL doesn't match, update `SUPABASE_URL` in Vercel
- Make sure you're using the same project as RENOIR (if sharing): `fmrucenpalbtbwhgrzto`

**Table Doesn't Exist:**
- Run the migration: `supabase-migration-persona-images.sql`
- Go to Supabase Dashboard → SQL Editor → Run the migration

**Network/DNS Issue:**
- Check if Supabase is accessible from Vercel
- The `directFetchTest` in the error response will show if it's a network issue

**SSL/Certificate Issue:**
- Rare, but can happen if Supabase URL is malformed
- Make sure URL starts with `https://`

### 4. Verify Migration Ran

1. Go to Supabase Dashboard
2. Navigate to **Table Editor**
3. You should see `persona_images` table
4. If not, run the migration SQL

### 5. Check Supabase Project Status

1. Go to https://supabase.com/dashboard
2. Select your project
3. Check if project is paused or has issues
4. Verify API is enabled

## Next Steps

After fixing the issue:
1. Wait for Vercel to redeploy (or trigger a redeploy)
2. Test `/api/test-supabase` endpoint again
3. Try generating a persona image

