# Running the Supabase Migration

## Quick Steps

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/fmrucenpalbtbwhgrzto
   - Or go to https://supabase.com/dashboard and select the project

2. **Open SQL Editor:**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Run the Migration:**
   - Copy the entire contents of `supabase-migration-persona-images.sql`
   - Paste into the SQL Editor
   - Click **Run** (or press Cmd/Ctrl + Enter)

4. **Verify:**
   - Go to **Table Editor**
   - You should see `persona_images` table
   - It should have columns: `id`, `persona_name`, `image_url`, `created_at`, `updated_at`

## Migration SQL

The migration creates:
- `persona_images` table
- Indexes for faster queries
- Updated_at trigger for automatic timestamp updates

## After Migration

Once the table is created:
1. Vercel will auto-redeploy with Supabase credentials
2. Try generating a persona image again
3. It should save successfully to Supabase!

## Troubleshooting

**"relation already exists"**
- Table already exists, that's fine! Migration is idempotent.

**"permission denied"**
- Make sure you're logged into the correct Supabase project
- Check you have admin access

**Still getting errors after migration**
- Check Vercel logs for specific error messages
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly

