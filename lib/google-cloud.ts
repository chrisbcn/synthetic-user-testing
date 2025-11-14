/**
 * Google Cloud / Vertex AI Authentication Utilities
 * 
 * Supports multiple authentication methods (matching RENOIR wardrobe project):
 * 1. Service account credentials (GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_ID) - ✅ Recommended for Vertex AI
 * 2. Service account JSON via GOOGLE_APPLICATION_CREDENTIALS
 * 3. Access token via GOOGLE_CLOUD_ACCESS_TOKEN env var
 * 4. Application Default Credentials (ADC) - for local dev with gcloud auth
 * 5. Metadata server (when running on GCP)
 * 
 * Note: API keys don't work with Vertex AI endpoints - they only work with Gemini API endpoints.
 * For Vertex AI (aiplatform.googleapis.com), use OAuth2 tokens from service accounts.
 */

import { GoogleAuth } from "google-auth-library"
import { logger } from "./utils"

export interface GoogleCloudConfig {
  projectId: string
  location: string
  accessToken?: string
  apiKey?: string
}

/**
 * Get Google Cloud access token
 * Tries multiple methods in order:
 * 1. Environment variable GOOGLE_CLOUD_ACCESS_TOKEN
 * 2. Metadata server (if running on GCP)
 * 3. Application Default Credentials (ADC) via Google Auth Library
 */
export async function getGoogleCloudAccessToken(): Promise<string | null> {
  // Method 1: Direct access token from env
  if (process.env.GOOGLE_CLOUD_ACCESS_TOKEN) {
    logger.debug("Using access token from GOOGLE_CLOUD_ACCESS_TOKEN env var")
    return process.env.GOOGLE_CLOUD_ACCESS_TOKEN
  }

  // Method 2: Try metadata server (if running on GCP)
  try {
    const metadataResponse = await fetch(
      "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
      {
        headers: {
          "Metadata-Flavor": "Google",
        },
        // Add timeout to avoid hanging
        signal: AbortSignal.timeout(2000),
      }
    )

    if (metadataResponse.ok) {
      const metadata = await metadataResponse.json()
      logger.debug("Retrieved access token from metadata server")
      return metadata.access_token
    }
  } catch (error) {
    // Not running on GCP or metadata server unavailable - this is fine
    logger.debug("Metadata server not available (not running on GCP)")
  }

  // Method 3: Service account from individual env vars (like RENOIR project) - ✅ Recommended for Vertex AI
  if (
    process.env.GOOGLE_CLIENT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_CLIENT_ID
  ) {
    try {
      const credentials = {
        type: "service_account",
        project_id: process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Handle escaped newlines
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
      }

      const auth = new GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      })
      const client = await auth.getClient()
      const accessToken = await client.getAccessToken()
      
      if (accessToken.token) {
        logger.debug("Retrieved access token from service account env vars (RENOIR pattern)")
        return accessToken.token
      }
    } catch (error) {
      logger.warn("Failed to get access token from service account env vars", error)
    }
  }

  // Method 4: Use Application Default Credentials (ADC) - works locally, not on Vercel
  try {
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    })
    const client = await auth.getClient()
    const accessToken = await client.getAccessToken()
    
    if (accessToken.token) {
      logger.debug("Retrieved access token from Application Default Credentials")
      return accessToken.token
    }
  } catch (error) {
    logger.warn("Failed to get access token from ADC", error)
    // This is okay - might not be configured yet
  }

  return null
}

/**
 * Get Google Cloud API key from environment
 * Checks GOOGLE_CLOUD_API_KEY and VERTEX_AI_API_KEY
 */
export function getGoogleCloudApiKey(): string | null {
  return process.env.GOOGLE_CLOUD_API_KEY || process.env.VERTEX_AI_API_KEY || null
}

/**
 * Get Google Cloud configuration
 * Note: For Vertex AI endpoints, OAuth2 tokens (from service accounts) are required.
 * API keys only work with Gemini API endpoints, not Vertex AI.
 */
export async function getGoogleCloudConfig(): Promise<GoogleCloudConfig | null> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
  if (!projectId) {
    return null
  }

  const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1"
  const accessToken = await getGoogleCloudAccessToken()
  // API keys are only for Gemini API, not Vertex AI - don't use for Vertex AI endpoints
  const apiKey = getGoogleCloudApiKey()

  return {
    projectId,
    location,
    accessToken: accessToken || undefined,
    apiKey: apiKey || undefined, // Only used for Gemini API endpoints, not Vertex AI
  }
}

/**
 * Build Vertex AI API endpoint URL
 * Note: Vertex AI endpoints require OAuth2 tokens, NOT API keys.
 * API keys only work with Gemini API endpoints (generativelanguage.googleapis.com).
 */
export function buildVertexAIEndpoint(
  projectId: string,
  location: string,
  model: string,
  method: "generateContent" | "predictLongRunning" | "fetchPredictOperation" = "generateContent",
  apiKey?: string // Ignored for Vertex AI - only used for Gemini API endpoints
): string {
  const baseUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}`
  
  let endpoint: string
  if (method === "predictLongRunning") {
    endpoint = `${baseUrl}:predictLongRunning`
  } else if (method === "fetchPredictOperation") {
    endpoint = `${baseUrl}:fetchPredictOperation`
  } else {
    endpoint = `${baseUrl}:generateContent`
  }
  
  // Note: API keys don't work with Vertex AI endpoints - they require OAuth2 Bearer tokens
  // API keys only work with Gemini API: https://generativelanguage.googleapis.com/...
  
  return endpoint
}

/**
 * Get authorization headers for Vertex AI API
 * Vertex AI endpoints require OAuth2 Bearer tokens (from service accounts), NOT API keys.
 * Matching RENOIR wardrobe project pattern.
 */
export async function getVertexAIHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // Vertex AI requires OAuth2 Bearer token (from service account)
  const token = await getGoogleCloudAccessToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  } else {
    logger.warn("No access token available for Vertex AI - authentication will fail. Ensure service account credentials are set.")
  }

  return headers
}

