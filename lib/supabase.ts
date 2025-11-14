/**
 * Supabase client setup
 * Matching RENOIR wardrobe project pattern
 */

import { createClient } from "@supabase/supabase-js"
import { logger } from "./utils"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn("Supabase credentials not configured. Persona images will not be saved.")
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!supabase
}

