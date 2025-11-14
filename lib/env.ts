import { validateEnvVars, logger } from "./utils"

// Environment variable validation
const REQUIRED_ENV_VARS = ["ANTHROPIC_API_KEY"]

const OPTIONAL_ENV_VARS = [
  "GEMINI_API_KEY",
  "BLOB_READ_WRITE_TOKEN",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "POSTGRES_URL",
]

export function validateEnvironment() {
  const validation = validateEnvVars(REQUIRED_ENV_VARS)

  if (!validation.isValid) {
    const errorMessage = `Missing required environment variables: ${validation.missing.join(", ")}`
    logger.error(errorMessage)
    
    // In production, we might want to throw an error
    // In development, we'll just log a warning
    if (process.env.NODE_ENV === "production") {
      throw new Error(errorMessage)
    } else {
      logger.warn(errorMessage)
      logger.warn("The application may not function correctly without these variables.")
    }
  }

  // Log optional env vars status
  const missingOptional = OPTIONAL_ENV_VARS.filter((key) => !process.env[key])
  if (missingOptional.length > 0) {
    logger.info(`Optional environment variables not set: ${missingOptional.join(", ")}`)
  }

  return {
    isValid: validation.isValid,
    missingRequired: validation.missing,
    missingOptional,
  }
}

// Validate on module load (server-side only)
if (typeof window === "undefined") {
  try {
    validateEnvironment()
  } catch (error) {
    // Error already logged, but don't crash the app during development
    if (process.env.NODE_ENV === "production") {
      throw error
    }
  }
}

