import { validateEnvVars, logger } from "./utils"

// Environment variable validation
const REQUIRED_ENV_VARS = ["ANTHROPIC_API_KEY"]

const OPTIONAL_ENV_VARS = [
  "GEMINI_API_KEY",
  "BLOB_READ_WRITE_TOKEN",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "POSTGRES_URL",
  // Google Cloud / Vertex AI
  "GOOGLE_CLOUD_PROJECT_ID",
  "GOOGLE_CLOUD_LOCATION",
  "GOOGLE_CLOUD_REGION", // Alternative to GOOGLE_CLOUD_LOCATION (used in Renoir)
  "GOOGLE_CLOUD_ACCESS_TOKEN",
  "GOOGLE_CLOUD_API_KEY", // API key from Vertex AI Studio (simplest auth method)
  "VERTEX_AI_API_KEY", // Alternative name for API key
  "GOOGLE_APPLICATION_CREDENTIALS",
  // Service account individual fields (like Renoir project)
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_EMAIL",
  "GOOGLE_PRIVATE_KEY_ID",
  "GOOGLE_PRIVATE_KEY",
  // Video generation
  "RUNWAY_API_KEY",
  // Vertex AI model names (optional - defaults provided)
  "VERTEX_AI_MODEL_VEO3",
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

