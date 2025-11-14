/**
 * Supabase client setup
 * Matching RENOIR wardrobe project pattern
 */

import { createClient } from "@supabase/supabase-js"
import { logger } from "./utils"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn("Supabase credentials not configured. Persona images will not be saved.", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
  })
}

// Create Supabase client (matching RENOIR pattern - simple, no special options)
// RENOIR creates client directly: createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!supabase && !!supabaseUrl && !!supabaseAnonKey
}

/**
 * Get Supabase configuration status (for debugging)
 */
export function getSupabaseConfig() {
  return {
    configured: isSupabaseConfigured(),
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : null,
    urlFull: supabaseUrl || null, // Full URL for debugging (safe to expose - it's public)
    keyLength: supabaseAnonKey?.length || 0,
  }
}

